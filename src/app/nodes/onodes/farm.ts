import {Node} from '../model/node';
import { NodeFactory } from  '../services/node-factory.service'

export class Farm extends Node {
    
    constructor(private _factory: NodeFactory) {
        super('Farm', _factory);
		this.name = 'Farm';
		this.subtype = 2000;
		this.status = 0;
		this.children = [];
		this.extendedData = {};
	}
}