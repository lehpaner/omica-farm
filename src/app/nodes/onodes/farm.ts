import {Node} from '../model/node';
import { NodeFactory } from  '../services/node-factory.service'

export interface IFarmData {
	id: string;
	name: string;
	contractType: string;
	soilType: string;
}

export class Farm extends Node {
    
    constructor(private _factory: NodeFactory) {
        super('Farm', _factory);
		this.name = 'Farm';
		this.subtype = 2000;
		this.status = 0;
		this.children = [];
		this.extendedData = {};
	}
	getFarmData(): IFarmData {
		let retval: IFarmData = <IFarmData> this.extendedData['farmData'];
		if(!retval) {
			retval = { id :'', name: '', contractType: '', soilType: '' };
		}
		return retval;
	}
	setFarmData(seed:IFarmData): void  {
		this.extendedData['farmData'] = seed;
	}
}