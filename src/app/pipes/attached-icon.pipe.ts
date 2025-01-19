import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { icon } from '@fortawesome/fontawesome-svg-core';
import {
  faHome,
  faBars,
  faCar,
  faCarOn,
  faCircleUser,
  faCalendarCheck,
  faCircleExclamation,
  faCircleCheck,
  faMagnifyingGlass,
  faMoon,
  faArrowUpRightFromSquare,
  faPenToSquare,
  faTrashCan,
  faPlus,
  faUsers,
  faRightFromBracket,
  faRightToBracket,
  faSun,
  faUser,
  faUserPlus,
  faThumbsUp,
  faStar,
  faFileSignature,
  faCircleChevronRight,
  faCoins,
} from '@fortawesome/free-solid-svg-icons';
import {
  faTrashCan as faSlimTrashCan,
  faPenToSquare as faSlimPenToSquare,
} from '@fortawesome/free-regular-svg-icons';

@Pipe({
  name: 'attachedIcon',
})
export class AttachedIconPipe implements PipeTransform {
  private iconMap = {
    faHome,
    faBars,
    faCar,
    faCarOn,
    faCircleUser,
    faCalendarCheck,
    faCircleCheck,
    faCircleExclamation,
    faMagnifyingGlass,
    faMoon,
    faArrowUpRightFromSquare,
    faPenToSquare,
    faTrashCan,
    faSlimTrashCan,
    faSlimPenToSquare,
    faPlus,
    faUsers,
    faRightFromBracket,
    faRightToBracket,
    faSun,
    faUser,
    faUserPlus,
    faThumbsUp,
    faStar,
    faFileSignature,
    faCircleChevronRight,
    faCoins,
  };

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, size: string = ''): SafeHtml {
    const faIcon = this.iconMap[value as keyof typeof this.iconMap];
    if (!faIcon) {
      return value;
    }

    let iconClass = '';
    if (size) {
      iconClass = `fa-${size}`;
    }

    const iconHtml = icon(faIcon).html.join('');
    const iconWithSize = `<span class="${iconClass}">${iconHtml}</span>`;
    return this.sanitizer.bypassSecurityTrustHtml(iconWithSize);
  }
}
