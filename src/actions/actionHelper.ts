import { Dispatch } from 'react';

import { AlertDialogData, DialogTypes } from '../types';
import {
  AuthenticationError,
  BadGatewayError,
  ExpiredAccessTokenError,
  GatewayTimeoutError,
  PermissionError,
  ServiceUnavailableError,
  SystemError,
} from '../app/http';
import { i18n } from '../app/i18n';

import { appModule, authModule } from '../modules';
import { TimeoutError } from 'ky';

class ActionHelper {
  showErrorDialog = (e: unknown, dispatch: Dispatch<any>) => {
    if (!(e instanceof Error)) {
      return '';
    }

    let message: string = i18n.t('messages:error.connectionRefused');
    let positiveAction = undefined;

    if (e instanceof TimeoutError) {
      // HTTP クライアント (ky) タイムアウト
      message = i18n.t('messages:error.timeout');
    }
    if (e instanceof AuthenticationError) {
      message = i18n.t('messages:error.HTTP401.authenticationFailed');
    }
    if (e instanceof ExpiredAccessTokenError) {
      message = i18n.t('messages:error.HTTP401.accessTokenExpired');
      positiveAction = () => {
        dispatch(authModule.actions.updateNeedsReauthentication(true));
      };
    }
    if (e instanceof PermissionError) {
      message = i18n.t('messages:error.HTTP403.permissionFailed');
    }
    if (e instanceof SystemError) {
      message = i18n.t('messages:error.HTTP500.systemError');
    }
    if (e instanceof BadGatewayError) {
      message = i18n.t('messages:error.HTTP502.badGateway');
    }
    if (e instanceof ServiceUnavailableError) {
      message = i18n.t('messages:error.HTTP503.serviceUnavailable');
    }
    if (e instanceof GatewayTimeoutError) {
      message = i18n.t('messages:error.HTTP504.gatewayTimeout');
    }

    const alertDialogData: AlertDialogData = {
      type: DialogTypes.ERROR,
      message,
      positiveAction,
    };
    dispatch(appModule.actions.updateAlertDialog(alertDialogData));
    dispatch(appModule.actions.updateLoading(false));
  };
}

export const actionHelper = new ActionHelper();
