import { Injectable } from '@nestjs/common';
import { response } from 'express';
import { URequest } from './URequest';
import { dataService } from './constants';

@Injectable()
export class Functions {
  constructor(private uRequest: URequest) {}

  async generate(system: string, user: string) {
    try {
      // const token = Date.NowToString("MMddyyyyhhmmssfff");
      const token = new Date();
      const date = token.toLocaleString();

      const operation = {};
      operation['apiKey'] = system;
      operation['table'] = 'sdw_generic.tbl_active_session';
      operation['fields'] = 'use_code';
      operation['condition'] = "use_code = '" + user + "'";

      const responseService = await this.uRequest.consumeDataServices(
        dataService + 'query',
        'post',
        operation,
      );

      if (responseService.result.length > 0) {
        operation['fields'] = "act_token = '" + date + "', act_fecins = NOW()";
        operation['values'] = '';
        operation['condition'] = "use_code = '" + user + "'";

        const responseEdit = await this.uRequest.consumeDataServices(
          dataService + 'edit',
          'put',
          operation,
        );

        if (responseEdit.message === 'Edición con exito') {
          return date;
        }
      } else {
        operation['apiKey'] = system;
        operation['table'] = 'sdw_generic.tbl_active_session';
        operation['fields'] = 'use_code, act_fecins, act_token';
        operation['values'] = "'" + user + "',now(), '" + date + "'";
        const responseAdd = await this.uRequest.consumeDataServices(
          dataService + 'add',
          'post',
          operation,
        );

        if (responseAdd.message === 'Adición con exito') {
          return date;
        }

        return '';
      }
    } catch (error) {
      return error;
    }

    return '';
  }

  async isProv(system: string, cli_code: string) {
    const sendData = {
      apiKey: system,
      fields: '*',
      table: 'str_generic.tbl_providers',
      condition: `cli_primar = '${cli_code}'`,
    };

    const respProv = await this.uRequest.consumeDataServices(
      dataService + 'query',
      'post',
      sendData,
    );

    if (respProv.result.length > 0 && Array.isArray(respProv.result)) {
      return true;
    } else {
      return false;
    }
  }

  async getClientProvider(system: string, cli_code: string) {
    let prv_code: string;

    const requestData = {
      apiKey: system,
      fields: 'prov.cli_primar',
      table:
        'str_generic.tbl_clients cli inner join str_generic.tbl_providers prov on prov.prv_code = cli.prv_code',
      condition: `cli_code = '${cli_code}'`,
    };

    const provider = await this.uRequest.consumeDataServices(
      dataService + 'query',
      'post',
      requestData,
    );

    if (provider.result.length > 0) {
      prv_code = provider.result[0].cli_primar;

      if (prv_code) {
        return prv_code;
      }
    }

    return cli_code;
  }
}
