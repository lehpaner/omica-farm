import {Node} from '../model/node';
import { NodeFactory } from  '../services/node-factory.service'

export class News extends Node {
    
    constructor(private _factory: NodeFactory) {
        super('News', _factory);
		this.name = 'News';
		this.subtype = 1161;
		this.status = 0;
		this.children = [];
		this.extendedData = {};
	}
}