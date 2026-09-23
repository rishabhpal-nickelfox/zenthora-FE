const express = require('express');
const path = require('path');

const app = express();

const COMPANY_HOSTS = 'azure.company-portal.hosts';
const CUSTOMER_HOSTS = 'azure.customer-portal.hosts';
const PAYMENT_FORMS_HOSTS = 'azure.payment-forms.hosts';

const companyHosts = COMPANY_HOSTS.split(',').map(h => h.trim());
const customerHosts = CUSTOMER_HOSTS.split(',').map(h => h.trim());
const paymentFormsHosts = PAYMENT_FORMS_HOSTS.split(',').map(h => h.trim());

const companyDistPath = path.join(__dirname, 'FE/company-portal');
const customerDistPath = path.join(__dirname, 'FE/customer-portal');

function getHost(req) {
  return (req.headers.host || '').split(':')[0].toLowerCase();
}

function getDomain(host) {
  const parts = host.split('.');
  if (parts.length < 2) return host;
  return parts.slice(-2).join('.');
}

function findMatchedHost(req, targetHosts) {
  const currentBase = getDomain(getHost(req));
  const match = targetHosts.find(h => getDomain(h.toLowerCase()) === currentBase);
  return match || targetHosts[0] || getHost(req);
}

function customerBaseUrl(req) {
  const host = findMatchedHost(req, customerHosts);
  return `https://${host}`;
}

function companyBaseUrl(req) {
  const host = findMatchedHost(req, companyHosts);
  return `https://${host}`;
}

function isCustomerHost(req) {
  return customerHosts.includes(getHost(req));
}

function isPaymentFormsHost(req) {
  return paymentFormsHosts.includes(getHost(req));
}

function isPaymentOnlyHost(req) {
  return isPaymentFormsHost(req) && !isCustomerHost(req);
}

function isCompanyHost(req) {
  return companyHosts.includes(getHost(req));
}

function getDistPath(req) {
  const host = getHost(req);
  if (companyHosts.includes(host)) {
    return companyDistPath;
  }
  if (customerHosts.includes(host)) {
    return customerDistPath;
  }
  if (paymentFormsHosts.includes(host)) {
    return customerDistPath;
  }
  return customerDistPath;
}

app.get('/company-portal/*', (req, res, next) => {
  const targetPath = req.originalUrl.replace(/^\/company-portal/, '') || '/';
  if (isCompanyHost(req)) return res.redirect(302, targetPath);
  return res.redirect(302, companyBaseUrl(req) + targetPath);
});

app.get('/customer-portal/*', (req, res, next) => {
  if (isPaymentOnlyHost(req)) return res.sendStatus(404);
  const targetPath = req.originalUrl.replace(/^\/customer-portal/, '') || '/';
  if (isCustomerHost(req)) return res.redirect(302, targetPath);
  return res.redirect(302, customerBaseUrl(req) + targetPath);
});

app.get('/pay/:token', (req, res, next) => {
  if (isPaymentOnlyHost(req)) return res.sendStatus(404);
  if(isCustomerHost(req)) return next();
  return res.redirect(302, customerBaseUrl(req) + `/pay/${req.params.token}`);
});

app.get('/forms/:companyCode/:paymentFormId', (req, res, next) => {
  if(isPaymentFormsHost(req)) return res.sendFile(path.join(customerDistPath, 'index.html'));
  if(isCustomerHost(req)) return next();
  return res.redirect(302, customerBaseUrl(req) + `/forms/${req.params.companyCode}/${req.params.paymentFormId}`);
});

app.get('/pdf/:key', (req, res, next) => {
  if(isCustomerHost(req)) return next();
  return res.redirect(302, customerBaseUrl(req) + `/pdf/${req.params.key}`);
});

app.use((req, res, next) => {
  express.static(getDistPath(req))(req, res, next);
});

app.get('*', (req, res) => {
  if (isPaymentOnlyHost(req)) return res.sendStatus(404);
  res.sendFile(path.join(getDistPath(req), 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
