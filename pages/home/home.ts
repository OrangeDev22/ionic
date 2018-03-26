import { Component } from '@angular/core';
import { NavController, 
  AlertController, // To Add Button
  ActionSheetController // To delete
 } from 'ionic-angular';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from '@firebase/util';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  currentUser:any;
  songsRef:any;
  songs: AngularFireList<any>;
  comments: AngularFireList<any>;
  commentsRef:any
  queryText: string;
  usersRef:any;
  users: AngularFireList<any>;
  constructor(
    public navCtrl: NavController, 
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public afDatabase: AngularFireDatabase,
    public afAuth: AngularFireAuth
  ) {
    this.songsRef = afDatabase.list('songs');
    this.songs = this.songsRef.valueChanges();
    this.usersRef = afDatabase.list('users');
    this.users = this.songsRef.valueChanges();
    afAuth.authState.subscribe(user => {
      if (!user) {
        this.currentUser = null;
        return;
      }
      this.currentUser = {uid:user.uid, photoURL: user.photoURL};
      
    });
  }
  addSong(){

    let prompt = this.alertCtrl.create({
      title: 'Song Name', 

      message: "Enter a name for this new song you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            const newSongRef = this.songsRef.push({});

   
            newSongRef.set({
              id: newSongRef.key,
              title: data.title,
              uid: this.currentUser.uid,
              likes: 0,
              description: "here you can write about this song",
              link: "No Value"

            });
          }
        }
      ]
    });
    prompt.present();
  }
  showUser(displayName, photoURL, userId){

  }
  showOptions(songId, songTitle,like, songDescription, songLink, displayName) {
   
  }

  gotoVideo(link){
    window.open(link, "_blank")
  }
  removeSong(songId: string){
    this.songsRef.remove(songId);
  }
  link(songId, songLink){
     let prompt = this.alertCtrl.create({
      title: 'Add a URL',
      message: "Update the URL for this song",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
          value: songLink
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.songsRef.update(songId, {
              link: data.title, lastUpdatedBy: this.currentUser.uid
            });
          }
        }
      ]
    });
    prompt.present();
  }
  likes(like, songId){
    like++;
    this.songsRef.update(songId, {
    likes: like,
    });
  }
  description(songId, songDescription){

      let prompt = this.alertCtrl.create({
      title: 'Add a description',
      message: "Update the description for this song",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
          value: songDescription
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.songsRef.update(songId, {
              description: data.title, lastUpdatedBy: this.currentUser.uid
            });
          }
        }
      ]
    });
    prompt.present();
  }
  updateSong(songId, songTitle){
    let prompt = this.alertCtrl.create({
      title: 'Song Name',
      message: "Update the name for this song",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
          value: songTitle
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.songsRef.update(songId, {
              title: data.title, lastUpdatedBy: this.currentUser.uid
            });
          }
        }
      ]
    });
    prompt.present();
  }
  searchUser(){
    
  }
  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then((response)=>{
      console.log('resultado login google:', response);
      
      const userRef = this.afDatabase.list('users');

      userRef.update(response.user.uid, 
        {
          userId: response.user.uid, 
          displayName: response.user.displayName,
          photoURL: response.user.photoURL
        });
      //userRef.push({userId: xx.user.uid, displayName: xx.user.displayName}).then((xx)=>{

      //});

    });
  }

  loginWithEmail() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.EmailAuthProvider()).then((xx)=>{

    });
  }
  logout() {
    this.afAuth.auth.signOut();
  }

}
