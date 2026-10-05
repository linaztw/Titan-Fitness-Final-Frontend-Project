import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService, Member } from '../../member';

@Component({
  selector: 'app-member-profile',
  standalone: true,
  imports: [],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.scss'
})
export class MemberProfileComponent {

  member = signal<Member | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private memberService: MemberService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      const cleanId = id.replace('#', '');

      this.memberService.getById(cleanId).subscribe({
        next: (member) => {
          this.member.set(member);
        },
        error: () => {
          console.log('Could not load member');
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/members']);
  }

  goToFreeze() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.router.navigate(['/members', id, 'freeze']);
    }
  }

  cancel() {
    this.goBack();
  }
}