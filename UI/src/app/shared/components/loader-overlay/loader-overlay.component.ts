import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '@app/services/loader.service';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@app/shared/pipes/translate.pipe';

@Component({
  selector: 'app-loader-overlay',
  standalone: true,
  imports: [CommonModule, AsyncPipe, TranslatePipe],
  templateUrl: './loader-overlay.component.html',
  styleUrls: ['./loader-overlay.component.scss']
})
export class LoaderOverlayComponent {
  constructor(public loader: LoaderService) {}
}



