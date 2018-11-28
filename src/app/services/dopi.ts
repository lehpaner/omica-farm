import { Inject, Injectable, EventEmitter } from '@angular/core';
import * as firebase from 'firebase/app';
import { AppCtx } from '../app.context';
import {  Node, IResultRestModel, IDapiChangedEvent, IAuthChangedEvent} from '../model';
import { IQNode, IDataRep } from '../nodes/model';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
/**
 * Document access api provides access to collections of data
 */
@Injectable()
export class DOPI {

securityChangeSubscription: Subscription;
canDo: boolean = false;
dopi: firebase.storage.Storage;
dopiRef: firebase.storage.Reference;


constructor(private _appCtx: AppCtx) { 
    this.securityChangeSubscription = this._appCtx.authChangedEvent.subscribe(u => this.onSecurityChanged(u))
    this.dopi = firebase.storage();
    this.dopiRef = firebase.storage().ref();
}
/*
public getFilesList(location: string): Promise<any> {
    return this.storage.bucket(location).getFiles().
    then((results) => {
      const files = results[0];
      console.log('Files:');
      files.forEach(file => {
        console.log(file.name);
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}
*/
public uploadText(fileName: string, location: string, text:string): Promise<IResultRestModel>  {
    // Upload file and metadata to the object 'images/mountains.jpg'
    console.log('Starting upload');
    let uploadTask = this.dopiRef.child( location + fileName);
    // Listen for state changes, errors, and completion of the upload.
    console.log('Waiting put response');
    return uploadTask.putString(text).then((snapshot) => {
        console.log(snapshot);
        let result: IResultRestModel  = { 
            result: 'SUCCESS',
            errorNumber: 0,
            message: null,
            data: snapshot.downloadURL
        };
        return result;
    }).catch((error) => {

        let result: IResultRestModel  = { 
            result: 'ERROR',
            errorNumber: -1,
            message: error.code,
            data: error
        };
        return result;
    });
}
public uploadTextFile(file: File, location: string): Promise<IResultRestModel>  {
    let metadata = { contentType: 'text/enriched' };
    // Upload file and metadata to the object 'images/mountains.jpg'
    let uploadTask: firebase.storage.UploadTask = this.dopiRef.child( location + file.name).put(file, metadata);
    return uploadTask.then((snapshot) => {
        console.log(snapshot);
        let result: IResultRestModel  = { 
            result: 'SUCCESS',
            errorNumber: 0,
            message: null,
            data: snapshot.downloadURL
        };
        return result;
    }).catch((error) => {

        let result: IResultRestModel  = { 
            result: 'ERROR',
            errorNumber: -1,
            message: error.code,
            data: error
        };
        return result;
    });
    // Listen for state changes, errors, and completion of the upload.
    /*
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        let state: string ='PROGRESS';
        let progress: number = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
            state = 'Upload is paused';
            break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
            state = 'Upload is running';
            break;
        let result: IResultRestModel  = { 
                result: 'PROGRESS',
                errorNumber: progress,
                message: state,
                data: snapshot
            };
        return result;
    }
    }, function(error) {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
        case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
        case 'storage/canceled':
        // User canceled the upload
        break;
        case 'storage/unknown':
    // Unknown error occurred, inspect error.serverResponse
        break;
    }
    let result: IResultRestModel  = { 
        result: 'ERROR',
        errorNumber: -1,
        message: '',
        data: error
    };
    return result;
}, function() {
    // Upload completed successfully, now we can get the download URL
    let documentUrl: string;
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        documentUrl = downloadURL;
        console.log('File available at', downloadURL);
    });
    let result: IResultRestModel  = { 
        result: 'SUCCESS',
        errorNumber: 0,
        message: null,
        data: documentUrl
    };
    return result;
});*/
}
private onSecurityChanged(event: IAuthChangedEvent): void {
    if(event.user.isAnonymous){
        this.canDo = false;
    } else if(event.user === null) {
        this.canDo = false;
    } else {
        this.canDo = true;
    }
    return;
  }
}