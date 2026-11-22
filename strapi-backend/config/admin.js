module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'elessaAdminJwtSecret2026SuperSecure'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'elessaApiTokenSalt2026'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'elessaTransferTokenSalt2026'),
    },
  },
});
