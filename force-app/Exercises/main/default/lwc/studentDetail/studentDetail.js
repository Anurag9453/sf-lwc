import { LightningElement, wire } from 'lwc';
import { getRecord, getFieldValue, getFieldDisplayValue } from 'lightning/uiRecordApi';
import { subscribe, unsubscribe, MessageContext } from
'lightning/messageService';
import SELECTED_STUDENT_CHANNEL from
'@salesforce/messageChannel/SelectedStudentChannel__c';

import FIELD_Name from '@salesforce/schema/Contact.Name';
import FIELD_Description from
'@salesforce/schema/Contact.Description';
import FIELD_Email from '@salesforce/schema/Contact.Email';
import FIELD_Phone from '@salesforce/schema/Contact.Phone';
const fields = [FIELD_Name, FIELD_Description, FIELD_Email,
    FIELD_Phone];

export default class StudentDetail extends LightningElement {

	// TODO #3: locate a valid Contact ID in your scratch org and store it in the studentId property.
	// Example: studentId = '003S000001SBAXEIA5';
	studentId;
	subscription;
	//TODO #4: use wire service to call getRecord, passing in our studentId and array of fields.
	//		   Store the result in a property named wiredStudent.

    @wire(getRecord, { recordId: '$studentId', fields })
    wiredStudent;
	
	@wire(MessageContext) messageContext;
	
	connectedCallback() {
		if(this.subscription){
		return;
		}
		this.subscription = subscribe(this.messageContext,SELECTED_STUDENT_CHANNEL,
		(message) => {
		this.handleStudentChange(message)
		}
		);
	}

	renderedCallback(){
		console.log('wiredStudent;;;;;'+JSON.stringify(this.wiredStudent));
	}
	disconnectedCallback() {
		unsubscribe(this.subscription);
		this.subscription = null;
	}

	handleStudentChange(message) {
		this.studentId = message.studentId;
		}

	get name() {
		return this._getDisplayValue(this.wiredStudent.data, FIELD_Name);
	}

    get description() {
        return this._getDisplayValue(this.wiredStudent.data,
        FIELD_Description);
        }
        get phone() {
        return this._getDisplayValue(this.wiredStudent.data,
        FIELD_Phone);
        }
        get email() {
        return this._getDisplayValue(this.wiredStudent.data,
        FIELD_Email);
        }
	//TODO #5: We provided a getter for the name field. 
	// 		   To prepare for Lab 1, create getters for the description, phone, and email fields.
	
	//TODO #6: Review the cardTitle getter, and the _getDisplayValue function below.
	
	get cardTitle() {
		let title = "Please select a student";
		if (this.wiredStudent.data) {
			title = this.name;
		} else if (this.wiredStudent.error) {
			title = "Something went wrong..."
		}
		return title;
	}
	
	_getDisplayValue(data, field) {
		return getFieldDisplayValue(data, field) ? getFieldDisplayValue(data, field) : getFieldValue(data, field);
	}
	
}