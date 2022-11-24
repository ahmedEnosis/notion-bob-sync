import fetch from 'node-fetch';
import lodash from 'lodash';

export default class Bob {
  constructor(bobToken, managerId) {
    this.managerId = managerId;
    this.bobToken = bobToken;
  }

  request(api, method = 'GET', payload = {}, query = {}) {
    return fetch(api, {
      method,
      headers: {
        Authorization: this.bobToken
      }
    })
      .then(response => response.json());

  }

  listTeamMembers() {
    return this
      .request('https://api.hibob.com/v1/people')
      .then(data => {
        return data.employees.filter(employee => lodash.get(employee, 'work.reportsToIdInCompany') === this.managerId);
      });
  }


}
