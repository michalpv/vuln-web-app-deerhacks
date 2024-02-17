const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const User = require('./models/userModel'); // Adjust the path as necessary

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(session({
  secret: 'fwt34bvit37nyfow3c48tn93ywc8',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true, maxAge: 3600000 }
}));

function generateInvoice() {
  const currentDate = new Date();
  const dueDate = new Date(currentDate.getTime() + (15 * 24 * 60 * 60 * 1000));
  const nextBillingDate = new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000));

  const rentalAmount = 1000;
  const taxRate = 0.1;
  const taxAmount = rentalAmount * taxRate;
  const totalAmountDue = rentalAmount + taxAmount;

  return `
Super-Secure-Residences
---------------------------------------
INVOICE FOR APARTMENT RENTAL

Date: ${currentDate.toLocaleDateString()}
Due Date: ${dueDate.toLocaleDateString()}
Next Billing Date: ${nextBillingDate.toLocaleDateString()}

Rental Period: ${currentDate.toLocaleDateString()} to ${nextBillingDate.toLocaleDateString()}
Rental Amount: $${rentalAmount.toFixed(2)}
Tax (10%): $${taxAmount.toFixed(2)}
Total Amount Due: $${totalAmountDue.toFixed(2)}

Thank you for choosing Super-Secure-Residences. We appreciate your business!

Please make sure your payment is received by the due date to avoid any late fees.
---------------------------------------
`;

}

function writeInvoice(invoiceName) {
  try {
    const invoice = generateInvoice();
    const invoicesDirPath = path.join(__dirname, 'invoices');

    if (!fs.existsSync(invoicesDirPath)) {
      fs.mkdirSync(invoicesDirPath, { recursive: true });
    }

    const invoiceFilePath = path.join(invoicesDirPath, invoiceName);
    console.log(`Creating invoice at: ${invoiceFilePath}`);

    fs.writeFileSync(invoiceFilePath, invoice);
    return invoiceName;
  } catch (error) {
    console.error("Error writing invoice:", error);
  }
}

function validateEmail(email) {
  // Regex taken from: https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS
  const emailRegex = /^([a-zA-Z0-9])(([\-.]|[_]+)?([a-zA-Z0-9]+))*(@){1}[a-z0-9]+[.]{1}(([a-z]{2,3})|([a-z]{2,3}[.]{1}[a-z]{2,3}))$/; // VULN (ReDoS): The regex pattern is vulnerable to denial of service
  // FIX: Use a non-backtracking regex pattern, or library like validator
  // return validator.isEmail(email);
  return emailRegex.test(email);
}

app.post('/api/register', async (req, res) => {
  try {
    console.log(`Registering user: ${req.body.email}`);
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send('Email already exists');
    }
    if (!validateEmail(req.body.email)) {
      return res.status(400).send('Please enter a valid email address');
    }

    const invoiceName = `${uuidv4()}.txt`;
    writeInvoice(invoiceName);
    const userObj = {
      ...req.body, // FIX: Replace with below:
      /*
      email: req.body.email,
      password: req.body.password
      */
      temperature: Math.floor(Math.random() * 100),
      humidity: Math.floor(Math.random() * 100),
      invoices: [
        {
          invoiceName,
          date: new Date(),
          amount: 1000,
        },
      ],
    };

    console.log('User object:', JSON.stringify(userObj, null, 2));

    const user = new User(userObj); // VULN (Mass assignment): req.body is not sanitized/can be manipulated to insert unwanted fields ex. isAdmin

    await user.save();

    res.status(200).send('User registered successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/login', async (req, res) => {
  try {
    console.log(`Attempting to log in user: ${req.body.email}`);
    const user = await User.findOne(req.body); // VULN (No password/attribute check): req.body can be manipulated to bypass authentication
    if (!user) {
      return res.status(400).send('User not found');
    }

    // FIX:
    // const user = await User.findOne({ email: req.body.email });
    // if (!user) {
    //   return res.status(400).send('User not found');
    // }

    // const isMatch = req.body.password === user.password;
    // if (!isMatch) {
    //   return res.status(400).send('Invalid credentials');
    // }

    req.session.userId = user._id;
    res.json({ email: user.email, isAdmin: user.isAdmin, roomNumber: user.roomNumber, temperature: user.temperature, humidity: user.humidity, invoices: user.invoices });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/api/userdata', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('Not authorized');
  }

  User.findById(req.session.userId).then(user => {
    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json({ email: user.email, isAdmin: user.isAdmin, roomNumber: user.roomNumber, temperature: user.temperature, humidity: user.humidity, invoices: user.invoices });
  }).catch(error => {
    res.status(500).send(error.message);
  });
});

app.get('/api/invoice', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('Not authorized');
  }

  if (!req.query.invoiceName) {
    return res.status(400).send('Invoice name is required');
  }

  // FIX:
  // const invoiceName = path.basename(req.query.invoiceName);
  // const invoicePath = path.join(__dirname, 'invoices', invoiceName);
  // if (!fs.existsSync(invoicePath) || path.dirname(invoicePath) !== path.join(__dirname, 'invoices')) {
  //   return res.status(404).send('Invoice not found');
  // }

  const invoicePath = path.join(__dirname, 'invoices', req.query.invoiceName);
  console.log(`Fetching invoice from: ${invoicePath}`);
  if (!fs.existsSync(invoicePath)) {
    return res.status(404).send('Invoice not found');
  }

  const invoice = fs.readFileSync(invoicePath, 'utf8');
  res.send(invoice);
});


app.get('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out, please try again');
    }
    res.send('User logged out successfully');
  });
});

app.get('/api/test', (req, res) => {
  res.send('OK');
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
