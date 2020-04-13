import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';

@Component({
  selector: 'app-profile-logo',
  templateUrl: './profile-logo.component.html',
  styleUrls: ['./profile-logo.component.css']
})
export class ProfileLogoComponent implements OnInit {

  @ViewChild('mainScreen', {static:true}) elementView: ElementRef;
  @Input() userName: string;
  divSize: any = 40;
  nameSize: any = 20;
  name: string = '.?.';
  profilePicId: string = 'null';
  isProfilePic: boolean = false;
  profilePicLocation: string = '../../../../assets/0.jpg'

  constructor() { }

  ngOnInit() {
    this.divSize = this.elementView.nativeElement.offsetHeight;
    this.nameSize = this.divSize / 2;
    this.profilePicId = localStorage.getItem('profilePicId');
    if(this.profilePicId != 'null')
    {
      this.isProfilePic = false;
      this.abbrName();
    }
    else
    {
      this.isProfilePic = true;
      this.abbrName();
      this.profilePicId = '../../../../assets' + this.profilePicId + '.jpg';
    }
  }

  abbrName()
  {
    var nameList;
    if(this.userName.indexOf('.') >= 0){
      nameList = this.userName.split('.');
    }
    else{
      nameList = this.userName.split(' ');
    }
    if(nameList.length>0)
    {
      this.name = '';
      for(var i=0; i<nameList.length&&i<2;i++)
      {
        this.name += nameList[i][0].toUpperCase();
      }
    }
  }
}
