import * as dotenv from 'dotenv'
dotenv.config();

import Bob from './bob.js';
import Notion from './notion.js';
import {getUpdatedNotionData} from "./utils.js";

const bobToken = process.env.BOB_TOKEN;
const notionToken = process.env.NOTION_TOKEN;
const notionDBId = process.env.NOTION_DB_ID;
const managerId = process.env.MANGER_ID;


let bob = new Bob(bobToken, managerId);
let notion = new Notion(notionToken, notionDBId);

Promise.all([bob.listTeamMembers(), notion.listEmployeesFromDB()])
  .then(employees => processTeamMembers(...employees))
  .then(data => {
    return Promise.all([
      ...data.existing.map(notion.updateEmployee.bind(notion)),
      ...data.new.map(notion.insertNewEmployee.bind(notion))
    ]);
  })
  .then(() => {
    console.log('Success!!');
  })
  .catch(console.log);


function processTeamMembers(bobTeamMembers, notionTeamMembers) {
  const employees = {
    new: [],
    existing: []
  };
  const notionEmployeeMap = {};

  notionTeamMembers.results.map(page => {
    if (page.object === 'page') {
      notionEmployeeMap[page.properties['Employee ID'].number] = page;
    }
  });

  bobTeamMembers.forEach(member => {
    const memberId = member.work.employeeIdInCompany;

    if (!!notionEmployeeMap[memberId]) {
      const updatedData = getUpdatedNotionData({
        bob: member,
        notion: notionEmployeeMap[memberId]
      });
      if (updatedData) {
        employees.existing.push(updatedData);
      }
    } else {
      employees.new.push(getUpdatedNotionData({bob: member, databaseId: notionDBId, notion: {}}));
    }

  });

  return employees;
}


