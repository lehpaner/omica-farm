import {Node} from '../model/node';
import { NodeFactory } from  '../services/node-factory.service'

export class PesticideApplication extends Node {
    
    constructor(private _factory: NodeFactory) {
        super('PesticideApplication', _factory);
		this.name = 'PesticideApplication';
		this.subtype = 2003;
		this.status = 0;
		this.children = [];
		this.extendedData = {};
	}
}