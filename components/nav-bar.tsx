import Router, { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';

import Avatar from 'components/avatar';

import { useUser } from 'lib/context/user';

interface MenuButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: string;
}

function MenuButton({
  onClick,
  disabled,
  children,
}: MenuButtonProps): JSX.Element {
  return (
    <button disabled={disabled} type='button' onClick={onClick}>
      {children}
      <style jsx>{`
        button {
          width: 100%;
          border: unset;
          margin: unset;
          font: unset;
          text-align: unset;
          appearance: unset;
          cursor: pointer;
          padding: 12px 36px 12px 24px;
          background: var(--background);
          transition: background 0.2s ease 0s;
          font-size: 16px;
          font-weight: 400;
          line-height: 18px;
        }

        button:hover {
          background: var(--accents-2);
        }

        button.disabled {
          cursor: not-allowed;
        }
      `}</style>
    </button>
  );
}

interface LinkProps {
  href: string;
  children: string;
}

function NavLink({ href, children }: LinkProps): JSX.Element {
  const { pathname } = useRouter();

  return (
    <Link href={href}>
      <a className={cn('nowrap', { active: pathname === href })}>
        {children}
        <style jsx>{`
          a {
            transition: color 0.2s ease 0s;
            color: var(--accents-5);
            text-decoration: none;
            cursor: pointer;
            font-size: 18px;
            font-weight: 400;
            line-height: 24px;
            height: 24px;
            margin: 16px 0;
            display: block;
          }

          a:not(.active):hover {
            color: var(--on-background);
          }

          a.active {
            cursor: not-allowed;
            font-weight: 700;
          }
        `}</style>
      </a>
    </Link>
  );
}

function MenuLink({ href, children }: LinkProps): JSX.Element {
  return (
    <Link href={href}>
      <a
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        target={href.startsWith('http') ? '_blank' : undefined}
        className='nowrap'
      >
        {children}
        <style jsx>{`
          a {
            display: block;
            padding: 12px 36px 12px 24px;
            background: var(--background);
            transition: background 0.2s ease 0s;
            color: var(--on-background);
            text-decoration: none;
            cursor: pointer;
            font-size: 16px;
            font-weight: 400;
            line-height: 18px;
          }

          a:hover {
            background: var(--accents-2);
          }
        `}</style>
      </a>
    </Link>
  );
}

export default function NavBar(): JSX.Element {
  const { loggedIn, user } = useUser();
  const [open, setOpen] = useState<boolean>(false);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);
  const logout = useCallback(async () => {
    setLoggingOut(true);
    await fetch('/api/logout');
    await Router.push('/login');
  }, []);

  return (
    <div className='wrapper'>
      <div className='content'>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className='reset avatar'
          type='button'
        >
          <Avatar loading={!loggedIn} src={user.photo} size={48} />
        </button>
        <div className={cn('menu', { open })}>
          <MenuLink href='/subscriptions'>Subscriptions</MenuLink>
          <MenuLink href='/archive'>Archive</MenuLink>
          <div className='line' />
          <MenuLink href='https://form.typeform.com/to/oTBbAI6z'>
            Send feedback
          </MenuLink>
          <MenuButton onClick={logout}>
            {loggingOut ? 'Logging out...' : 'Logout'}
          </MenuButton>
        </div>
        <nav>
          <NavLink href='/'>Feed</NavLink>
          <NavLink href='/quick-read'>Quick read</NavLink>
          <NavLink href='/resume'>Resume</NavLink>
        </nav>
      </div>
      <style jsx>{`
        .wrapper {
          flex: none;
          width: 120px;
          margin-right: 24px;
        }

        .content {
          position: sticky;
          z-index: 4;
          top: 96px;
        }

        .menu {
          pointer-events: none;
          transform: translateX(-50%);
          position: absolute;
          top: 60px;
          left: 24px;
          opacity: 0;
          padding: 4px 0;
          overflow: hidden;
          border-radius: 8px;
          background: var(--background);
          box-shadow: var(--shadow-medium);
          transition: top 0.2s ease 0s, opacity 0.2s ease 0s;
        }

        .menu.open {
          pointer-events: unset;
          top: 72px;
          opacity: 1;
        }

        .menu .line {
          border-top: 1px solid var(--accents-2);
          margin: 4px 0;
        }

        nav {
          margin-top: 120px;
        }
      `}</style>
    </div>
  );
}
