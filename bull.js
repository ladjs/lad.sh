const Bull = require('@ladjs/bull');
const Graceful = require('@ladjs/graceful');
const pSeries = require('p-series');

const config = require('./config');
const queues = require('./queues');
const logger = require('./helpers/logger');

const bull = new Bull({
  logger,
  queues,
  queue: {
    prefix: `bull_${config.env}`
  }
});

if (!module.parent) {
  const graceful = new Graceful({
    bulls: [bull],
    logger
  });

  (async () => {
    try {
      const translateMarkdown = bull.queues.get('translate-markdown');
      await pSeries([
        () => translateMarkdown.empty(),
        () => translateMarkdown.add()
      ]);

      const translatePhrases = bull.queues.get('translate-phrases');
      await pSeries([
        () => translatePhrases.empty(),
        () => translatePhrases.add()
      ]);

      await Promise.all([bull.start(), graceful.listen()]);

      if (process.send) process.send('ready');
      logger.info('Lad job scheduler started');
    } catch (err) {
      logger.error(err);
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1);
    }
  })();
}

module.exports = bull;
