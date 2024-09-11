import { LightningElement, api } from 'lwc';

const CSS_CLASS = 'selectedRow';
export default class ResponsiveDatatable extends LightningElement {
	@api columnConfig
	@api pkField

	rows;
	_selected

	@api get rowData(){
		return this.rows;
	}
	set rowData(value){
		if(typeof value !== 'undefined'){
			this.rows = this.reformatRows(value)
		}
	}
	reformatRows = function(rowData) {
		let colItems = this.columnConfig;
		let reformattedRows = [];

		console.log('rowData;;;;'+JSON.stringify(rowData));
		for (let i = 0; i < rowData.length; i++) {
			let rowDataItems = [];
			for (let j = 0; j < colItems.length; j++) {
				let colClass = '';
				if (colItems[j].hiddenOnMobile) {
					colClass = 'hiddenOnMobile';
				}
				rowDataItems.push({
					value: rowData[i][colItems[j].fieldName],
					label: colItems[j].label,
					type: colItems[j].type,
					class: colClass,
					columnId: 'col' + j + '-' + rowData[i][this.pkField],
					isPhone: (colItems[j].type==='phone'),
					isEmail: (colItems[j].type==='email'),
					isOther: (colItems[j].type!=='phone' && colItems[j].type!=='email')
				});
			}
			reformattedRows.push({
				data: rowDataItems,
				pk: rowData[i][this.pkField]
			});
		}
		return reformattedRows;
	}

	handleRowClick(event){
		const target = event.currentTarget;
		const evt = new CustomEvent('rowclick',{
			detail:{
				pk: target.attribute('data-pk')
			}
		})
		this.dispatchEvent(evt);
		this.highlightedSelectedRow(target);
	
	}
	handleRowDblClick(event){
		const target = event.currentTarget;
		const evt = new CustomEvent('rowdblclick',{
			detail:{
				pk: target.attribute('data-pk')
			}
		})
		this.dispatchEvent(evt);
		//this.highlightedSelectedRow(target);
	
	}


	highlightedSelectedRow(target){
		if(this._selected){
			this._selected.classList.remove(CSS_CLASS);
		}
		target.classList.add(CSS_CLASS);

		this._selected = target;
	}
}