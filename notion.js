import { Client } from '@notionhq/client';

export default class Notion{
  constructor(notionKey, dbId){
    this.databaseId = dbId;
    this.notion = new Client({ auth: notionKey });
  }

  listEmployeesFromDB() {
    return this.notion.databases.query({
      database_id: this.databaseId
    });
  }

  insertNewEmployee(employeeData){
    return this.notion.pages.create(employeeData)
  }

  updateEmployee(employeeData){
    return this.notion.pages.update(employeeData)
  }
}
