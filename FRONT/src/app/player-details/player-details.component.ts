import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.scss']
})
export class PlayerDetailsComponent implements OnInit {
  playerId: number | undefined;
  player: any;

  constructor(private api: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.playerId = +this.route.snapshot.paramMap.get('id')!;
    this.api.getPlayerById(this.playerId).subscribe(player => {
      this.player = player;
    });
  }
}