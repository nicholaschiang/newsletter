import { ReactNode, useCallback, useEffect, useState } from 'react';
import NProgress from 'nprogress';
import Router from 'next/router';
import axios from 'axios';

import Button from 'components/button';
import LockIcon from 'components/icons/lock';
import Page from 'components/page';
import SyncIcon from 'components/icons/sync';
import UndoIcon from 'components/icons/undo';

import { period } from 'lib/utils';
import usePage from 'lib/hooks/page';

interface SectionProps {
  icon: ReactNode;
  header: string;
  children: string;
}

function Section({ icon, header, children }: SectionProps): JSX.Element {
  return (
    <div className='section'>
      <div className='icon'>{icon}</div>
      <div className='content'>
        <h2>{header}</h2>
        <p>{children}</p>
      </div>
      <style jsx>{`
        .section {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin: 36px 0;
        }

        .icon {
          background: var(--accents-2);
          border-radius: 100%;
          padding: 12px;
          height: 48px;
          width: 48px;
          flex: none;
        }

        .content {
          margin-left: 24px;
        }

        h2 {
          line-height: 20px;
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 6px;
        }

        p {
          line-height: 16px;
          font-size: 14px;
          font-weight: 400;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

export default function LoginPage(): JSX.Element {
  usePage({ name: 'Login' });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!loading) {
      NProgress.done();
    } else {
      NProgress.start();
      setError('');
    }
  }, [loading]);
  useEffect(() => {
    if (error) setLoading(false);
  }, [error]);

  const onClick = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: This API request isn't really necessary. I'm pretty sure that the
      // login link won't be changing anytime soon, so we should be able to just
      // hardcode this into the front-end or as an environment variable.
      // See: https://github.com/googleapis/google-auth-library-nodejs/blob/241063a8c7d583df53ae616347edc532aec02165/src/auth/oauth2client.ts#L522
      const { data: link } = await axios.options<string>('/api/login');
      await Router.push(link);
    } catch (e) {
      setError(`Hmm, it looks like we hit a snag. ${period(e.message)}`);
    }
  }, []);

  return (
    <Page title='Login - Return of the Newsletter'>
      <div className='wrapper'>
        <div className='dialog'>
          <h1>A few things to know, before we get started</h1>
          <div className='line' />
          <Section icon={<SyncIcon />} header='Syncs with your Gmail'>
            You won’t need to get a new email address or subscribe to all your
            newsletters again.
          </Section>
          <Section
            icon={<LockIcon />}
            header='We don’t read your email, promise'
          >
            We’ll request a few Gmail permissions to help us organize your
            newsletters. Nothing else.
          </Section>
          <Section icon={<UndoIcon />} header='Your newsletters are yours'>
            You can always go back to reading them in your inbox; we won’t be
            offended.
          </Section>
          <div className='actions'>
            <Button disabled={loading} onClick={onClick} google>
              Continue signing in
            </Button>
            {error && <p className='error'>{error}</p>}
          </div>
        </div>
        <div className='scrim' />
        <style jsx>{`
          h1 {
            color: var(--accents-5);
            line-height: 24px;
            font-size: 20px;
            font-weight: 700;
            margin: 48px 0 24px;
          }

          .line {
            border-top: 2px solid var(--accents-2);
            margin: 24px 0 48px;
          }

          .actions {
            margin: 48px 0;
          }

          .actions > :global(button) {
            width: 100%;
          }

          .error {
            color: var(--error);
            line-height: 14px;
            font-size: 12px;
            font-weight: 500;
            margin-top: 12px;
          }

          .wrapper {
            position: fixed;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            z-index: 1;
          }

          .dialog {
            max-width: 540px;
            max-height: calc(100% - 32px);
            background: var(--background);
            border-radius: 10px;
            box-shadow: var(--shadow-large);
            overflow: auto;
            padding: 0 48px;
          }

          .scrim {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: rgba(0, 0, 0, 0.32);
            opacity: 1;
          }

          @media (max-width: 540px) {
            .dialog {
              box-shadow: none;
              max-height: 100%;
            }

            .scrim {
              display: none;
            }
          }

          @media (max-width: 450px) {
            .dialog {
              padding: 0 24px;
            }

            h1 {
              margin-top: 24px;
            }

            .actions {
              margin-bottom: 24px;
            }
          }
        `}</style>
      </div>
    </Page>
  );
}
