import NavBar from 'components/nav-bar';
import Page from 'components/page';
import Feed from 'components/feed';

import usePage from 'lib/hooks/page';

export default function ArchivePage(): JSX.Element {
  usePage({ name: 'Archive', login: true });

  return (
    <Page title='Archive - Return of the Newsletter'>
      <div className='page'>
        <NavBar />
        <Feed archive />
        <style jsx>{`
          .page {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            max-width: 1048px;
            padding: 0 48px;
            margin: 96px auto;
          }
        `}</style>
      </div>
    </Page>
  );
}