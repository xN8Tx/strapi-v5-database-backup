/**
 * Application methods
 */
import bootstrap from './bootstrap';
import register from './register';

/**
 * Plugin server methods
 */
import config from './config';
import controllers from './controllers';
import routes from './routes';
import services from './services';

export default {
  register,
  bootstrap,
  config,
  controllers,
  routes,
  services,
};
