import api from './axios';
import { Toast } from './middleware';

interface PApi {
  routeName: string;
  params?: {};
  config?: {};
}

interface PErrorAlert {
  status: number;
  message: any;
}

const apiErrorAlert = (params: PErrorAlert) => {
  switch (params.status) {
    case 204:
      Toast.fire({ icon: 'error', title: 'Server not responding' });
      break;
    case 401:
      Toast.fire({ icon: 'warning', title: params.message });
      break;
    case 403:
      Toast.fire({ icon: 'warning', title: 'Please relogin.' });
      break;
    case 404:
      Toast.fire({ icon: 'error', title: 'Server cannot be found' });
      break;
    case 405:
      Toast.fire({ icon: 'warning', title: params.message });
      break;
    case 422:
      Toast.fire({ icon: 'warning', title: params.message });
      break;
    case 502:
      Toast.fire({ icon: 'error', title: 'Server Error' });
      break;
    case 12023:
      Toast.fire({ icon: 'error', title: params.message });
      break;
    default:
      Toast.fire({
        icon: 'error',
        title: `Returned error request ${status}!. Please try again later`,
      });
      break;
  }
};

export const routesPostApi = async (props: PApi) => {
  return api
    .post(props.routeName, props.params)
    .then((res: any) => {
      return res;
    })
    .catch((err) => {
      console.log('err', err.response.data);
      const status = err.response === undefined ? 12023 : err.response.status;
      const message =
        err.response === undefined
          ? 'Server Maintenance!'
          : err.response.data.message;
      apiErrorAlert({ status, message });
      return {
        data: err.response?.data,
        status,
      };
    });
};

export const routesPutApi = async (props: PApi) => {
  return api
    .put(props.routeName, props.params)
    .then((res: any) => {
      return res;
    })
    .catch((err) => {
      console.log('err', err.response.data);
      const status = err.response === undefined ? 12023 : err.response.status;
      const message =
        err.response === undefined
          ? 'Server Maintenance!'
          : err.response.data.message;
      apiErrorAlert({ status, message });
      return {
        data: err.response?.data,
        status,
      };
    });
};

export const routesGetApi = async (props: PApi) => {
  return api
    .get(props.routeName, props.config)
    .then((res: any) => {
      return res;
    })
    .catch((err) => {
      console.log('err', err.response.data);
      const status = err.response === undefined ? 12023 : err.response.status;
      const message =
        err.response === undefined
          ? 'Server Maintenance!'
          : err.response.data.message;
      apiErrorAlert({ status, message });
      return {
        data: err.response?.data,
        status,
      };
    });
};
