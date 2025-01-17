import Router, { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import ArchiveIcon from 'components/icons/archive';
import ArrowBackIcon from 'components/icons/arrow-back';
import UnarchiveIcon from 'components/icons/unarchive';

import breakpoints from 'lib/breakpoints';

export interface ControlsProps {
  disabled: boolean;
  archived: boolean;
  archive: () => void;
}

export default function Controls({
  disabled,
  archived,
  archive,
}: ControlsProps): JSX.Element {
  const [visible, setVisible] = useState<boolean>(true);
  const lastScrollPosition = useRef<number>(0);

  useEffect(() => {
    function handleScroll(): void {
      const currentScrollPosition = window.pageYOffset;
      const prevScrollPosition = lastScrollPosition.current;
      lastScrollPosition.current = currentScrollPosition;
      setVisible(() => {
        const scrolledUp = currentScrollPosition < prevScrollPosition;
        const scrolledToTop = currentScrollPosition < 10;
        return scrolledUp || scrolledToTop;
      });
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { query } = useRouter();

  return (
    <div className={cn('controls', { visible })}>
      <div className='wrapper'>
        <button
          onClick={() =>
            query.ref === 'email' ? Router.push('/') : Router.back()
          }
          className='reset button'
          type='button'
        >
          <ArrowBackIcon />
        </button>
        <button
          onClick={archive}
          disabled={disabled}
          className='reset button'
          type='button'
        >
          {archived ? <UnarchiveIcon /> : <ArchiveIcon />}
        </button>
      </div>
      <style jsx>{`
        .controls {
          position: fixed;
          opacity: 0;
          top: 48px;
          left: 60px;
          right: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: top 0.2s ease 0s, opacity 0.2s ease 0s;
          pointer-events: none;
          z-index: 4;
        }

        .controls.visible {
          opacity: 1;
          top: 96px;
        }

        .wrapper {
          width: 100%;
          max-width: 948px;
          padding: 0 24px;
        }

        .button {
          display: block;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 100%;
          border: 1px solid var(--accents-2);
          background: var(--background);
          transition: background 0.2s ease 0s;
          margin-bottom: 10px;
          pointer-events: initial;
        }

        .button:last-child {
          margin-bottom: unset;
        }

        .button:hover {
          background: var(--accents-2);
        }

        .button:disabled {
          cursor: wait;
        }

        .button :global(svg) {
          fill: var(--accents-5);
          transition: fill 0.2s ease 0s;
        }

        .button:hover :global(svg) {
          fill: var(--on-background);
        }

        @media (max-width: ${breakpoints.mobile}) {
          .controls {
            bottom: -40px;
            left: unset;
            right: 24px;
            top: unset;
            transition: bottom 0.2s ease 0s, opacity 0.2s ease 0s;
          }

          .controls.visible {
            top: unset;
            bottom: 24px;
          }

          .wrapper {
            padding: unset;
            display: flex;
            border-radius: 48px;
            box-shadow: var(--shadow-medium);
            background: var(--background);
            padding: 8px;
          }

          .button {
            margin-bottom: unset;
            border: none;
          }
        }
      `}</style>
    </div>
  );
}
