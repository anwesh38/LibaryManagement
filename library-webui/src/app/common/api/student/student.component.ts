import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';
import { Page } from 'src/app/shared/Page';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  message: string | undefined;
  //ngx datatable parameters
  rows = [];
  page = new Page();
  control = true;
  //student insert form parameters
  cities: Array<any> = [];
  StudentInsertForm: FormGroup;
  showModal = true;
  constructor(private route: ActivatedRoute,
              private alert: AlertifyService,
              private studentService: StudentService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loadStaticPage();
  }
  loadStaticPage(){
    this.setPage({ offset: 0 });
    this.LoadStudentInsertForm();
  }
  setPage(pageInfo) {
    this.control = true;
    this.page.page = pageInfo.offset;
    this.studentService.getAllPageable(this.page).subscribe(pagedData => {
      this.page.size = pagedData.size;
      this.page.page = pagedData.page;
      this.page.totalElements = pagedData.totalElements;
      this.rows = pagedData.content;
    });
  }

  LoadStudentInsertForm(){
    this.getAllCities();
    this.showModal = true;
    this.StudentInsertForm = this.formBuilder.group({
      'fullname':     [null, [Validators.required]],
      'tcNo':         [null, [Validators.min(10000000000),Validators.max(100000000000),Validators.required]],
      'email':        [null, [Validators.required,Validators.email]],
      'phone':        [null, [Validators.required]],
      'address':      [null, [Validators.required]],
      'city':         [null, [Validators.required]],
      'university':   [null, [Validators.required]],
      'department':   [null, [Validators.required]],
    });
  }

  insertStudent(){
    if (!this.StudentInsertForm.valid) {
      return;
    }
    this.studentService.post(this.StudentInsertForm.value).subscribe(res=>{
      this.loadStaticPage();
      console.log("insert student");
      this.message = ' Kay??t Yap??lm????t??r.. ';
      this.showModal = false;
      this.alert.success(' Kay??t Yap??lm????t??r.. ');
      this.message = ' Kay??t i??lemi ba??ar??l??.';
    }, error => {
      this.alert.error(' Kay??t Yap??lamad??. Email adresi veya tc no hatal??d??r. ' );
      this.message = ' Kay??t Yap??lamad??.  Email adresi veya tc no hatal??d??r.' ;
    });
  }

  getAllCities(){
    this.studentService.getAllCities().subscribe(res => {
      this.cities = res;
    });
  }
  deleteStudent(id){
    console.log(id);
    this.studentService.delete(id).subscribe(res => {
      this.loadStaticPage();
      this.message = ' Kay??t Silinmi??tir. ';
      this.alert.warning(' Kay??t Silinmi??tir. ');
    }, error => {
      this.alert.error(' Hay Aksi Kay??t Silinemedi. ' );
      this.message = ' Hay Aksi Kay??t Silinemedi. ' ;
    });
  }
  get sif() { return this.StudentInsertForm.controls; }
}
