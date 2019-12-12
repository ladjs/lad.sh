const Router = require('@koa/router');
const render = require('koa-views-render');
const { authenticator } = require('otplib');
const qrcode = require('qrcode');

const policies = require('../../helpers/policies');
const web = require('../../app/controllers/web');

const router = new Router({ prefix: '/my-account' });

async function createQRCode(ctx) {
  const uri = authenticator.keyuri(
    ctx.state.user.email,
    'lad.sh',
    ctx.state.user.two_factor_token
  );
  const qrImage = await qrcode.toDataURL(uri);
  ctx.qrcode = qrImage;
}

router.use(policies.ensureLoggedIn);
router.use(policies.ensure2fa);
router.use(async (ctx, next) => { 
  await createQRCode(ctx);
  return next();
});
router.use(web.breadcrumbs);
router.get('/', render('my-account'));
router.put('/', web.myAccount.update);
router.delete('/security', web.myAccount.resetAPIToken);
router.get('/security', render('my-account/security'));
router.post('/security', web.myAccount.setup2fa);

module.exports = router;
