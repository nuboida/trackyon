import {
  trigger,
  animate,
  transition,
  style,
  query,
  group,
  AnimationGroupMetadata,
  AnimationQueryMetadata
} from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* => *', [
    query(
      ':enter',
      [style({ opacity: 0 })],
      { optional: true }
    ),
    query(
      ':leave',
      [style({ opacity: 1 }), animate('0.3s', style({ opacity: 0 }))],
      { optional: true }
    ),
    query(
      ':enter',
      [style({ opacity: 0 }), animate('0.3s', style({ opacity: 1 }))],
      { optional: true }
    )
  ])
]);

export const sliderAnimation =
  trigger('routeAnimations', [
    transition('* <=> *', slideTo('right') ),
  ]);

function slideTo(direction: string): (AnimationQueryMetadata | AnimationGroupMetadata)[] {
  const optional = { optional: true };
  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 100,
        [direction]: 0,
        width: '100%'
      })
    ], optional),
    query(':enter', [
      style({ [direction]: '-100%'})
    ]),
    group([
      query(':leave', [
        animate('300ms ease', style({ [direction]: '100%'}))
      ], optional),
      query(':enter', [
        animate('300ms ease', style({ [direction]: '0%'}))
      ])
    ]),
    // Normalize the page style... Might not be necessary

    // Required only if you have child animations on the page
    // query(':leave', animateChild()),
    // query(':enter', animateChild()),
  ];
}
