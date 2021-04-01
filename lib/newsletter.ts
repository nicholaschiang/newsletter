import { Message, getHeader, parseFrom } from 'lib/gmail';

export type Newsletter = {
  name: string;
  from: string;
  selected: boolean;
  icon_url: string;
  category: 'important' | 'other';
};

export function isNewsletter(message: Message): false | Newsletter {
  const from = getHeader(message, 'from');
  if (!from) {
    return false;
  }
  const { name, email } = parseFrom(from);
  if (
    whitelistedNewsletters[name.toLowerCase()] ||
    hasWhitelistedDomain(email)
  ) {
    return {
      name: name,
      from: email,
      selected: true,
      icon_url: iconURLFromEmail(name, email),
      category: 'important',
    };
  }
  const hasListUnsubscribe = getHeader(message, 'list-unsubscribe');
  if (!hasListUnsubscribe) {
    return false;
  }
  return {
    name: name,
    from: email,
    selected: false,
    icon_url: iconURLFromEmail(name, email),
    category: 'other',
  };
}

export function iconURLFromEmail(name: string, email: string): string {
  const result = whitelistedNewsletters[name.toLowerCase()];
  console.log(name, email, result);
  if (result && result !== true && result.asset_url) {
    return result.asset_url;
  }
  let domain = email.slice(email.indexOf('@') + 1);
  if (domain.startsWith('e.')) {
    domain = domain.slice(2);
  }
  if (domain.startsWith('email.')) {
    domain = domain.slice(6);
  }
  if (domain.startsWith('mail.')) {
    domain = domain.slice(5);
  }
  return 'https://www.google.com/s2/favicons?sz=64&domain_url=' + domain;
}

function hasWhitelistedDomain(email: string) {
  const domain = email.slice(email.indexOf('@') + 1);
  return !!whitelistedDomains[domain.toLowerCase()];
}

const whitelistedDomains = {
  'substack.com': true,
  'every.to': true,
  'stratechery.com': true,
  '2pml.com': true,
  'cassidoo.co': true,
  'e.newyorktimes.com': true,
  'atlasobscura.com': true,
  'e.economist.com': true,
  'getrevue.co': true,
};

const whitelistedNewsletters = {
  '#coolshit': true,
  '#the100dayproject': true,
  '101 blockchain st': true,
  '101 cookbooks': true,
  '2pm by web smith': true,
  '3-2-1 by james clear': true,
  '3drops': true,
  '7 questions with sequoia': true,
  'a junior vc': true,
  'a media operator': true,
  "aashay's newsletter": true,
  abacus: true,
  'abundance insider': true,
  accelerated: true,
  'agents and books': true,
  'aha substack': true,
  "alex danco's substack": true,
  'all raise': true,
  "amy's newsletter": true,
  "an artist's guide to computation": true,
  'andrew chen': true,
  astan: true,
  "austin kleon's newseltter": true,
  avc: true,
  'avoid boring people': true,
  'awesome people list': true,
  'axios am': true,
  'axios china': true,
  'axios cities': true,
  'axios future': true,
  'axios login': true,
  'backstage capital newsletter': true,
  'bank on basak': true,
  'beautiful voyager': true,
  'being patient': true,
  'benedict evans': { asset_url: '/assets/icons/benedictevans.jpeg' },
  'beyond the first order': true,
  'big by matt stoller': true,
  'blackbird spyplane': true,
  'blake robbins substack newsletter': true,
  'blogging for devs': true,
  'book freak': true,
  'brain pickings': true,
  'breakout startups': true,
  'brian balfour': true,
  'bugger oaf': true,
  bullets: true,
  'business breakdowns': true,
  "buster's rickshaw": true,
  'career contessa': true,
  cbinsights: true,
  "cereal mag's newsletter": true,
  changeletter: true,
  'check your pulse': true,
  'chips + dips': true,
  'colors & fonts': true,
  'consumer startups': true,
  'contrary capital': true,
  cozy: true,
  creativemornings: true,
  'creator tools weekly': true,
  'css weekly': true,
  'culture crave': true,
  culturebanx: true,
  'cup of jo': true,
  'curious commerce': true,
  'daily carnage': true,
  'daily dive': true,
  'daily stoic by ryan holiday': true,
  'data elixir': true,
  'dataset daily': true,
  'david cain': true,
  'deez links': true,
  "delian's ramblings": true,
  'dense discovery': true,
  'design luck': true,
  dezeen: true,
  'dig well': true,
  divinations: true,
  'drawing links': true,
  'dreams of electric sheep': true,
  'drinking from the firehose': true,
  'dynamically typed': true,
  'east meets west': true,
  eater: true,
  'elad gill': true,
  'eliot peper': true,
  "elizabeth yin's newsletter": true,
  'empty your cup': true,
  'engineering growth': true,
  episodes: true,
  'erik bernhardsson': true,
  ethhub: true,
  "eugene wei's remains of the day": true,
  'european straits': true,
  "evca's growth vertical newsletter": true,
  everything: true,
  'eye on': true,
  'fake pixels': true,
  'farnam street blog': true,
  femstreet: true,
  finimize: true,
  finshots: true,
  'fintech today': true,
  'first round review': true,
  'five best ideas of the day': true,
  'five books': true,
  'five bullet friday': true,
  'five links by auren hoffman': true,
  'five things running': true,
  'five things': true,
  'for the interested': true,
  'forbes women': true,
  'formats unpacked': true,
  'forte labs': true,
  'forward thinking': true,
  'founder to founder': true,
  'frauvis weekly': true,
  'from the desk of alicia kennedy': true,
  'future of teamwork': true,
  'futuribile / curating futures': true,
  'geoff yamane': true,
  'get together': true,
  'getro.org': true,
  'ggv the next billion': true,
  'girls night in': true,
  'good better best': true,
  'good food jobs': true,
  'grow.co': true,
  'hacker newsletter': true,
  'health tech reads': true,
  'heartcore consumer insights': true,
  heydesigner: true,
  'high tea': true,
  'hip paris': true,
  "howie's list": true,
  hrdlist: true,
  'hustle trends': true,
  'import ai': true,
  'in digestion': true,
  inboxreads: true,
  increment: true,
  inkstone: true,
  'insights blog': true,
  'inspiration bits': true,
  'investor amnesia': true,
  'investors therapy': true,
  'jayson lusk': true,
  "josh constine's moving product": true,
  "julia evan's programming newsletter": true,
  'julian shapiro': true,
  'justin mares the next brand': true,
  'keeping up with india': true,
  "kening's newsletter": true,
  "kevin ryan's: culture matters": true,
  "kinfolk's newsletter": true,
  'klf newsletter': true,
  'kneeling bus': true,
  kwokchain: true,
  "l'atelier": true,
  labs: true,
  'last week in aws': true,
  'late checkout by greg isenberg': true,
  'launch ticker': true,
  'le cinq': true,
  'lean luxe': true,
  "lenny's newsletter": true,
  'li jin': true,
  'living while black': true,
  "lolita taub's substack": true,
  longform: true,
  'maker mind': true,
  makerlist: true,
  margins: true,
  'master the meta': true,
  "matt levine's money stuff": true,
  "matt's thoughts in between": true,
  'mercedes bent': true,
  'metaphor map': true,
  'michael simmons': true,
  mobihealthnews: true,
  'monday musings': true,
  'money talk': true,
  monomythical: true,
  'moontower musings': true,
  'more to that': true,
  'morning brew': true,
  'need to know: coronavirus': true,
  'ness labs': true,
  'net interest': true,
  'next big thing': true,
  'next draft': true,
  nfx: true,
  'nick dewilde': true,
  'nitin julka': true,
  'no mercy / no malice': true,
  nocode: true,
  'non-gaap thoughts': true,
  'normcore tech': true,
  'not a newsletter': true,
  'not boring': true,
  'notes from tom critchlow': true,
  'on being': true,
  'online mag for computing machinery': true,
  'out of pocket': true,
  oversharing: true,
  oversimplified: true,
  palladium: true,
  'pm hq': true,
  'podcast notes': true,
  'pods and recs by colby donovan': true,
  pointer: true,
  'power plays': true,
  'product hunt daily': true,
  'product lost by @hipcityreg': true,
  'product school': true,
  'product solving': true,
  propertyname1: true,
  'public announcement': true,
  "pycoder's weekly": true,
  'quartz africa weekly brief': { asset_url: '/assets/icons/quartz.jpg ' },
  'quartz daily brief': { asset_url: '/assets/icons/quartz.jpg ' },
  'quartz daily obsession': { asset_url: '/assets/icons/quartz.jpg ' },
  'quick brown fox': true,
  'quick wins': true,
  raceahead: true,
  'radii weekly': true,
  'raisin bread': true,
  're-thinking real estate': true,
  recomendo: true,
  'remote students': true,
  'remote work': true,
  retales: true,
  'retire in bali': true,
  'revise weekly': true,
  'rewriting culture by rex woodbury': true,
  're•thinking': true,
  'rock health': true,
  'roll call': true,
  rosieland: true,
  'sam couch': true,
  'samo burja': true,
  'scott galloway': true,
  "seth's blog": true,
  'side project stack': true,
  sidebar: true,
  'silicon.news': true,
  simplanations: true,
  sinocism: true,
  'sital week': true,
  'sixth tone': true,
  sloww: true,
  'smashing newsletter': true,
  softwareleadweekly: true,
  'sogal newsletter': true,
  'something i saw': true,
  'south china morning post': true,
  sparktoro: true,
  "sriram krishnan's substack": true,
  stratechery: true,
  'strictly vc': true,
  'subject matter': true,
  'sunday snapshots': true,
  supchina: true,
  superorganizers: true,
  'swipe file': true,
  'sydney paige thomas': true,
  'talk therapy': true,
  "tanay's newsletter": true,
  'tech in asia': true,
  'tech support': true,
  'tech twitter tldr': true,
  techloaf: true,
  technically: true,
  'the ad spot': true,
  'the algorithm': true,
  'the ann friedman weekly': true,
  'the art of gig': true,
  'the bootstrapped founder': true,
  'the breeze': true,
  'the broadsheet': true,
  'the browser': true,
  'the buzz by berkman klein center': true,
  'the creative independent': true,
  'the crunchbase daily': true,
  'the daily drake': true,
  'the dapp list': true,
  'the data science roundup': true,
  'the defiant': true,
  'the delightfulness project': true,
  'the diff by byrne hobart': true,
  'the digital campfire download': true,
  'the dispatch': true,
  'the fintech blueprint': true,
  'the flip': true,
  'the g-l review': true,
  'the generalist': true,
  'the good trade': true,
  'the growth newsletter': true,
  'the highlighter': true,
  'the hustle': true,
  'the information': { asset_url: '/assets/icons/theinformation.png' },
  'the interface': true,
  'the jacuzzi': true,
  'the journal by kevin rose': true,
  'the jungle gym': true,
  'the kicks you wear': true,
  'the last chip': true,
  'the latinx collective': true,
  'the looking glass': true,
  'the memo from quartz at work': true,
  'the monday medley': true,
  'the morning briefing': true,
  'the moz top 10': true,
  'the new consumer': true,
  'the nutgraf': true,
  'the observer effect': true,
  'the orbital index': true,
  'the profile': true,
  'the proof': true,
  'the recount': true,
  'the rocket report': true,
  'the ryan holiday reading recommendation email': true,
  'the sidewalk weekly': true,
  'the sociology of business': true,
  'the sometimes newsletter': true,
  'the sunday dispatches': true,
  'the sunday soother': true,
  'the takeoff': true,
  'the upside': true,
  'the waiting room': true,
  'the week in newsletters': true,
  'this is not new': true,
  this: true,
  'tiny newsletter': true,
  'tiny revolutions': true,
  'tippets by taps': true,
  tldr: true,
  'tomasz tunguz': true,
  'too wordy': true,
  'total annarchy': true,
  trapital: true,
  trends: true,
  'trendslates ecommerce newsletter': true,
  'tribe capital essays': true,
  turnaround: true,
  "turner's substack": true,
  'un(real)': true,
  'unique business models': true,
  unslush: true,
  'ux design weekly': true,
  'vc starter kit': true,
  'venture desktop': true,
  'ventured south': true,
  'vice news': true,
  "victoria's thoughts on cybersecurity": true,
  'visible hands': true,
  'vivid & vague': true,
  'vox sentences': true,
  'wait but why': true,
  'week in ethereum': true,
  'weekend briefing with kyle': true,
  'weekly forekast': true,
  'wellness wisdom': true,
  'what if ventures': true,
  'what the elle': true,
  "what's hot in enterprise it/vc": true,
  wheelhouse: true,
  'why is this interesting?': true,
  'work from home by brianne kimmel': true,
  'work-bench enterprise weekly': true,
  'working on it': true,
  'write the docs': true,
  'young makers': true,
  'zeihan on geopolitics': true,
  'hugo amsellem': true,
  'jessica lessin': { asset_url: '/assets/icons/theinformation.png' },
};