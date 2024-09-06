import { LightningElement,wire } from 'lwc';
import getStudents from '@salesforce/apex/StudentBrowser.getStudents'; 
import { publish, MessageContext } from
'lightning/messageService';
import SELECTED_STUDENT_CHANNEL from
'@salesforce/messageChannel/SelectedStudentChannel__c';
export default class StudentBrowser extends LightningElement {
   studentList;   
   selectedDeliveryId = '';
   selectedInstructorId = '';

    @wire(getStudents, { instructorId: "$selectedInstructorId", courseDeliveryId:"$selectedDeliveryId"})
      students;

    @wire(MessageContext) messageContext;

    constructor() {
        super();
        const studentNames = ['Rad', 'Stuart', 'Andres', 'Rahul', 'Amit', 'Simon'];
        this.studentList = studentNames.map( (studentName, index) => {
          return {
            'sobjectType': 'Contact',
            'Name': studentName,
            'PhotoUrl': '/services/images/photo/003B0FakePictId',
            'Id': index
          };

          console.log(this.studentList);
    });
}
handleFilterChange(event){
  console.log('event;;;;;'+JSON.stringify(event));
  this.selectedDeliveryId = event.detail.deliveryId;
  this.selectedInstructorId = event.detail.instructorId;
  }

  handleStudentSelected(event){
    const studentId = event.detail.studentId;
    console.log('studentId;;;;;'+studentId);
    this.updateSelectedStudent(studentId);
    }
    updateSelectedStudent(studentId){
      publish(this.messageContext, SELECTED_STUDENT_CHANNEL, {
      studentId: studentId
      });
    }
}