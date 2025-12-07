import Head from 'next/head';
import { useState } from 'react';

export default function Music0fLaw() {
  const [activeSection, setActiveSection] = useState('');

  const sections = [
    { id: 'jurisdiction', title: 'I. Jurisdiction & Parties', num: '1' },
    { id: 'need', title: 'II. Statement of Need', num: '2' },
    { id: 'background', title: 'III. Organizational Background', num: '3' },
    { id: 'oracle', title: 'IV. Oracle v. Google Application', num: '4' },
    { id: 'fairuse', title: 'V. Four-Factor Fair Use Analysis', num: '5' },
    { id: 'ai', title: 'VI. AI & Copyright Obsolescence', num: '6' },
    { id: 'programs', title: 'VII. Five Program Areas', num: '7' },
    { id: 'technology', title: 'VIII. Technology Platform', num: '8' },
    { id: 'community', title: 'IX. Community Building', num: '9' },
    { id: 'timeline', title: 'X. Four-Year Timeline', num: '10' },
    { id: 'budget', title: 'XI. Budget & Resources', num: '11' },
    { id: 'litigation', title: 'XII. Litigation Strategy', num: '12' },
    { id: 'pipeline', title: 'XIII. DJ to JD Pipeline', num: '13' },
    { id: 'curriculum', title: 'XIV. Curriculum Framework', num: '14' },
    { id: 'relief', title: 'XV. Prayer for Relief', num: '15' },
    { id: 'contact', title: 'XVI. Verification & Contact', num: '16' },
  ];

  return (
    <>
      <Head>
        <title>NRS Agenda of Music0fLaw | DJ Rights Legal Advocacy</title>
        <meta name="description" content="Establishing DJ Performances as Protected Fair Use: A Legal Advocacy Campaign for Artists' Rights. Join the coalition." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="NRS Agenda of Music0fLaw - DJ Rights Legal Complaint" />
        <meta property="og:description" content="Case No. 2025-CV-DJRIGHTS: Establishing DJ Performances as Protected Fair Use" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* Navigation Sidebar */}
      <nav style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <span style={styles.caseNum}>Case No. 2025-CV-DJRIGHTS</span>
          <h3 style={styles.sidebarTitle}>TABLE OF CONTENTS</h3>
        </div>
        <div style={styles.navSections}>
          <div style={styles.navGroup}>
            <span style={styles.navGroupTitle}>Preliminary Matters</span>
            {sections.slice(0, 3).map(s => (
              <a key={s.id} href={`#${s.id}`} style={styles.navLink}>{s.title}</a>
            ))}
          </div>
          <div style={styles.navGroup}>
            <span style={styles.navGroupTitle}>Legal Framework</span>
            {sections.slice(3, 6).map(s => (
              <a key={s.id} href={`#${s.id}`} style={styles.navLink}>{s.title}</a>
            ))}
          </div>
          <div style={styles.navGroup}>
            <span style={styles.navGroupTitle}>Program & Operations</span>
            {sections.slice(6, 9).map(s => (
              <a key={s.id} href={`#${s.id}`} style={styles.navLink}>{s.title}</a>
            ))}
          </div>
          <div style={styles.navGroup}>
            <span style={styles.navGroupTitle}>Strategic Plan</span>
            {sections.slice(9, 12).map(s => (
              <a key={s.id} href={`#${s.id}`} style={styles.navLink}>{s.title}</a>
            ))}
          </div>
          <div style={styles.navGroup}>
            <span style={styles.navGroupTitle}>Educational Mission</span>
            {sections.slice(12, 14).map(s => (
              <a key={s.id} href={`#${s.id}`} style={styles.navLink}>{s.title}</a>
            ))}
          </div>
          <div style={styles.navGroup}>
            <span style={styles.navGroupTitle}>Conclusion</span>
            {sections.slice(14).map(s => (
              <a key={s.id} href={`#${s.id}`} style={styles.navLink}>{s.title}</a>
            ))}
          </div>
        </div>
        <div style={styles.joinCTA}>
          <a href="#join" style={styles.joinButton}>JOIN THE COALITION</a>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        <article style={styles.document}>

          {/* Header */}
          <header style={styles.header}>
            <div style={styles.courtHeader}>
              <p style={styles.courtText}>Before the Court of Public Opinion</p>
              <p style={styles.courtText}>and the Supreme Court of the United States</p>
            </div>

            <h1 style={styles.title}>NRS AGENDA OF MUSIC0FLAW</h1>
            <p style={styles.subtitle}>"Establishing DJ Performances as Protected Fair Use: A Legal Advocacy Campaign for Artists' Rights"</p>

            <div style={styles.orgInfo}>
              <p>A 501(c)(3) Nonprofit Organization | Est. 2025 | Fresno, California</p>
            </div>

            <div style={styles.parties}>
              <div style={styles.party}>
                <span style={styles.partyLabel}>Petitioner</span>
                <span style={styles.partyName}>Electronic Music Artists & DJs Worldwide</span>
              </div>
              <div style={styles.vsBox}>v.</div>
              <div style={styles.party}>
                <span style={styles.partyLabel}>Respondent</span>
                <span style={styles.partyName}>Outdated Copyright Enforcement Systems</span>
              </div>
            </div>

            <div style={styles.caseNumber}>
              <span>Case No. 2025-CV-DJRIGHTS</span>
            </div>
          </header>

          {/* Section I: Jurisdiction */}
          <section id="jurisdiction" style={styles.section}>
            <h2 style={styles.sectionTitle}>SECTION I: Jurisdiction, Venue & Parties</h2>

            <p style={styles.paragraph}><strong>1.</strong> NRS Agenda of Music0fLaw is a 501(c)(3) nonprofit organization founded in 2025 and headquartered in Fresno, California. The organization emerged from NRS Group of Fresno, a business consulting practice established in 2016 serving content creators and entertainment professionals.</p>

            <p style={styles.paragraph}><strong>2.</strong> This Complaint invokes the transformative fair use doctrine under 17 U.S.C. § 107 as interpreted by the Supreme Court in <em>Oracle America, Inc. v. Google LLC</em>, 141 S. Ct. 1183 (2021), seeking recognition that DJ performances constitute protected transformative works.</p>

            <p style={styles.paragraph}><strong>3.</strong> The organization is led by Nigel A. Marin, J.D., who earned his Juris Doctor degree in 2020 and brings twenty-five years of fiduciary experience and twenty years of SEC compliance background. Mr. Marin sat for the California Bar Examination in July 2025 with results pending.</p>

            <div style={styles.infoBox}>
              <h4 style={styles.infoBoxTitle}>Corporate Address</h4>
              <p>NRS Agenda of Music0fLaw<br/>
              1690 W. Shaw Ave, 2nd Floor, Suite 220<br/>
              Fresno, California 93711<br/>
              Tel: (559) 894-2003<br/>
              Email: legal@nrsgroupfresno.com</p>
            </div>

            <p style={styles.paragraph}><strong>4.</strong> The organization operates in partnership with Techno-Agenda.com, a 501(c)(3) nonprofit partner providing community access, event infrastructure, and charitable contribution capacity.</p>

            <p style={styles.paragraph}><strong>5.</strong> <strong>Federal Subject Matter Jurisdiction:</strong> Claims arise under the Copyright Act of 1976, 17 U.S.C. § 101 et seq., particularly the fair use provisions of 17 U.S.C. § 107. Federal courts have exclusive jurisdiction over copyright claims pursuant to 28 U.S.C. § 1338(a).</p>

            <p style={styles.paragraph}><strong>6.</strong> <strong>Standing:</strong> NRS Agenda of Music0fLaw brings claims on behalf of members who are electronic DJs and music producers whose works have been subjected to automated copyright enforcement without fair use consideration. These members have suffered concrete injuries including content removal, revenue diversion, account termination, and audience loss.</p>
          </section>

          {/* Section II: Statement of Need */}
          <section id="need" style={styles.section}>
            <h2 style={styles.sectionTitle}>SECTION II: Statement of Need</h2>

            <p style={styles.paragraph}><strong>7.</strong> Electronic music represents one of the most vibrant art forms of the twenty-first century. The global electronic dance music industry generates over nine billion dollars annually, supporting hundreds of thousands of artists worldwide. At its heart are disc jockeys who create live performances by mixing recorded music into continuous, transformative artistic experiences.</p>

            <p style={styles.paragraph}><strong>8.</strong> Despite their central role, DJs face a systemic legal threat. Automated copyright enforcement systems deployed by YouTube, Twitch, SoundCloud, and Facebook routinely flag DJ performances as infringement. These systems cannot distinguish between pirated uploads and transformative artistic performances.</p>

            <div style={styles.highlightBox}>
              <h4 style={styles.highlightTitle}>Consequences for DJs</h4>
              <p>When a DJ uploads or streams, automated Content ID systems:</p>
              <ul style={styles.list}>
                <li>Monetize DJ content for record labels instead of the performing artist</li>
                <li>Mute or remove audio entirely</li>
                <li>Issue copyright strikes leading to account termination</li>
                <li>Interrupt or shut down live streams in real time</li>
              </ul>
            </div>

            <p style={styles.paragraph}><strong>9.</strong> This enforcement regime treats transformative artists as infringers. A DJ who spends years perfecting mixing techniques receives the same treatment as someone uploading a pirated album. Automated systems have no capacity for artistic judgment.</p>

            <blockquote style={styles.blockquote}>
              "Electronic DJs are artists. Their performances are transformative works of original expression. The law should recognize what audiences have always known."
              <cite style={styles.cite}>— NRS Agenda of Music0fLaw Mission Statement</cite>
            </blockquote>

            <p style={styles.paragraph}><strong>10.</strong> The constitutional foundation of copyright—"to promote the Progress of Science and useful Arts" (Article I, Section 8, Clause 8)—presupposes that monopoly rights incentivize creation benefiting the public. When automated systems suppress transformative works without review, they invert this purpose.</p>

            <p style={styles.paragraph}><strong>11.</strong> The economic stakes are substantial. A professional DJ invests thousands in equipment, software, and training. A single automated claim can destroy months of work, eliminate income, and damage reputation—all without any human evaluating fair use.</p>
          </section>

          {/* Section III: Background */}
          <section id="background" style={styles.section}>
            <h2 style={styles.sectionTitle}>SECTION III: Organizational Background</h2>

            <p style={styles.paragraph}><strong>12.</strong> The organization reflects a twenty-year commitment to justice for artists. In 2005, the founder conceived a mobile application to help creative professionals manage their work with dignity—an idea ahead of its time but grounded in the principle that marginalized creative workers deserve the same protections as any professional.</p>

            <div style={styles.timeline}>
              <div style={styles.timelineItem}>
                <span style={styles.timelineYear}>2005</span>
                <p>First vision: platform for creative professionals requiring business infrastructure and legal protection.</p>
              </div>
              <div style={styles.timelineItem}>
                <span style={styles.timelineYear}>2016</span>
                <p>NRS Group of Fresno established as business consulting practice serving content creators.</p>
              </div>
              <div style={styles.timelineItem}>
                <span style={styles.timelineYear}>2020</span>
                <p>Juris Doctor degree earned, representing culmination of systematic legal preparation.</p>
              </div>
              <div style={styles.timelineItem}>
                <span style={styles.timelineYear}>2022</span>
                <p>Immersion in electronic music scene commenced, learning culture, economics, and systematic exploitation DJs face.</p>
              </div>
              <div style={styles.timelineItem}>
                <span style={styles.timelineYear}>2025</span>
                <p>NRS Agenda of Music0fLaw founded, launching comprehensive four-year strategic plan.</p>
              </div>
            </div>

            <p style={styles.paragraph}><strong>13.</strong> The art of disc jockeying emerged in the 1970s with pioneers like Grandmaster Flash, DJ Kool Herc, and Afrika Bambaataa, who transformed turntables into musical instruments. They invented techniques—scratching, beat-juggling, mixing—creating entirely new expression from existing recordings.</p>

            <p style={styles.paragraph}><strong>14.</strong> Under NRS Group of Fresno, four interconnected platforms are being developed:</p>
            <ul style={styles.list}>
              <li><strong>NRS Group of Fresno</strong> — Business consulting and compliance coaching</li>
              <li><strong>Echo-Agenda.com</strong> — Future 501(c)(3) for legal and business education</li>
              <li><strong>Getoff.it.com</strong> — DJ mix hosting treating DJs as rights-holders</li>
              <li><strong>Techno-Agenda.com</strong> — Electronic music education with legal literacy</li>
            </ul>
          </section>

          {/* Section IV: Oracle v. Google */}
          <section id="oracle" style={styles.section}>
            <h2 style={styles.sectionTitle}>SECTION IV: Application of Oracle v. Google</h2>

            <p style={styles.paragraph}><strong>15.</strong> The Supreme Court's 2021 decision in <em>Oracle America, Inc. v. Google LLC</em> fundamentally changed fair use analysis. The Court recognized that transformative use serving a different purpose constitutes fair use, even when copyrighted material is used as building blocks.</p>

            <p style={styles.paragraph}><strong>16.</strong> This precedent has never been applied to DJ performances, leaving a critical gap in legal protection. Our central legal argument:</p>

            <blockquote style={styles.blockquote}>
              "Algorithmic DJ sets, pattern-based techno production, and code-like electronic compositions should be treated as transformative systems, not automatically as infringing derivative works."
            </blockquote>

            <p style={styles.paragraph}><strong>17.</strong> Justice Breyer's majority opinion emphasized that fair use is "an equitable rule of reason" adapting to new technological contexts. Rigid application of copyright to functional interfaces would harm the creative ecosystem copyright promotes. This reasoning applies to DJ performances, which use recorded tracks as functional building blocks.</p>

            <p style={styles.paragraph}><strong>18.</strong> DJ performances present an even stronger case than Oracle. While Google copied Java API declarations for interoperability, DJs transform recordings through creative manipulation—adding effects, adjusting tempo, blending harmonies—producing continuous artistic experiences fundamentally different from underlying recordings. If copying software declarations for interoperability constitutes fair use, transforming recordings for artistic expression surely qualifies.</p>
          </section>

          {/* Section V: Four-Factor Analysis */}
          <section id="fairuse" style={styles.section}>
            <h2 style={styles.sectionTitle}>SECTION V: Four-Factor Fair Use Analysis</h2>

            <p style={styles.paragraph}><strong>19.</strong> 17 U.S.C. § 107 codifies fair use through four factors. NRS Agenda of Music0fLaw has developed a comprehensive framework applying each to DJ performances:</p>

            <div style={styles.factorGrid}>
              <div style={styles.factorBox}>
                <h4 style={styles.factorTitle}>Factor One: Purpose & Character</h4>
                <p>Transformative purpose creating new artistic works for live entertainment. DJ performances transform individual recordings into continuous experiences through skilled mixing, effects processing, beat-matching, and live creative decisions.</p>
              </div>
              <div style={styles.factorBox}>
                <h4 style={styles.factorTitle}>Factor Two: Nature of Work</h4>
                <p>Functional use of recorded tracks as building blocks. Under Oracle, functional elements receive less protection. DJ performances use recordings as functional interfaces—building blocks for new expression—rather than substitutes for original listening.</p>
              </div>
              <div style={styles.factorBox}>
                <h4 style={styles.factorTitle}>Factor Three: Amount Used</h4>
                <p>Reasonable amount with substantial original contribution. Professional performances incorporate portions of dozens of tracks, each transformed through mixing and effects. The DJ's creative contribution—selection, arrangement, transformation—constitutes the work's "heart."</p>
              </div>
              <div style={styles.factorBox}>
                <h4 style={styles.factorTitle}>Factor Four: Market Effect</h4>
                <p>Favorable effect with complementary relationship. DJ performances do not substitute for purchasing originals. Research shows DJ exposure increases track sales. The relationship is complementary—DJs serve as discovery mechanisms benefiting rights-holders.</p>
              </div>
            </div>

            <p style={styles.paragraph}><strong>20.</strong> <em>Campbell v. Acuff-Rose Music, Inc.</em>, 510 U.S. 569 (1994), established that transformative use—"adding something new, with a further purpose or different character"—is the heart of fair use. DJ performances epitomize this: combining recordings into continuous experiences expressing the DJ's unique vision. No two performances are identical because the DJ's creative choices constitute original expression.</p>

            <div style={styles.highlightBox}>
              <h4 style={styles.highlightTitle}>The Transformative Nature of DJ Performance</h4>
              <p>A professional DJ set is not a playlist. It incorporates dozens of creative decisions per minute: tempo adjustment, harmonic mixing, effect application, phrase alignment, energy management, audience response. The DJ transforms recordings into a unified experience existing nowhere else.</p>
            </div>
          </section>

          {/* Section VI: AI & Copyright */}
          <section id="ai" style={styles.section}>
            <h2 style={styles.sectionTitle}>SECTION VI: AI & Copyright Obsolescence</h2>

            <p style={styles.paragraph}><strong>21.</strong> The four-factor fair use test—foundation of every music copyright case—is catastrophically inadequate for the AI era. A framework designed for photocopiers cannot adjudicate disputes involving systems that generate works at incomprehensible scales.</p>

            <p style={styles.paragraph}><strong>22.</strong> <strong>Factor One Breakdown:</strong> AI systems lack "purpose" in any legally cognizable sense. When generative AI ingests millions of works during training then outputs new compositions, what is the "purpose"? Training differs from generation differs from end-user purpose.</p>

            <p style={styles.paragraph}><strong>23.</strong> <strong>Factor Two Breakdown:</strong> AI training datasets contain everything—published and unpublished, creative and factual—processed identically. Courts cannot weigh the "nature" of a corpus containing all human musical output.</p>

            <p style={styles.paragraph}><strong>24.</strong> <strong>Factor Three Breakdown:</strong> AI models don't "copy" traditionally. They extract statistical relationships and probabilistic distributions. An AI trained on every Beatles song may produce output with zero recognizable melodies while embodying deep structural patterns.</p>

            <p style={styles.paragraph}><strong>25.</strong> <strong>Factor Four Breakdown:</strong> AI-generated music creates market harm simultaneously total and untraceable. When AI generates infinite songs in any artist's style, the market is theoretically devastated—yet no specific output can be identified as causing specific harm.</p>

            <div style={styles.highlightBox}>
              <h4 style={styles.highlightTitle}>The Agentic AI Crisis</h4>
              <p>Autonomous AI agents will soon monitor trends in real-time, generate content instantly, publish across every channel simultaneously, handle licensing negotiations with other AI systems, and optimize through continuous iteration. Infinite content. Zero human involvement. Machine speed. The four-factor test cannot evaluate this.</p>
            </div>

            <p style={styles.paragraph}><strong>26.</strong> Copyright's constitutional foundation presupposes human creators requiring economic incentive. If AI generates unlimited works without motivation, copyright's justification collapses. NRS Agenda of Music0fLaw is developing strategic litigation aimed at forcing constitutional confrontation with copyright's foundations.</p>
          </section>

          {/* Section VII: Five Programs */}
          <section id="programs" style={styles.section}>
            <h2 style={styles.sectionTitle}>SECTION VII: Five Program Areas</h2>

            <p style={styles.paragraph}><strong>27.</strong> The DJ Rights Legal Advocacy Initiative encompasses five interconnected program areas:</p>

            <div style={styles.programGrid}>
              <div style={styles.programBox}>
                <span style={styles.programNum}>1</span>
                <h4>Legal Research & Analysis</h4>
                <p>Comprehensive legal framework applying Oracle v. Google to DJ performances, demonstrating all four statutory factors favor fair use.</p>
              </div>
              <div style={styles.programBox}>
                <span style={styles.programNum}>2</span>
                <h4>Technology Development</h4>
                <p>DJ Copyright Defense Calculator enabling DJs to analyze performances under both traditional and Oracle frameworks. Includes Safe Usage Calculator, Dispute Generator, Documentation Tool, and Analytics Dashboard.</p>
              </div>
              <div style={styles.programBox}>
                <span style={styles.programNum}>3</span>
                <h4>Community Building</h4>
                <p>Circle Event Series bringing together DJs, producers, and industry professionals for education, networking, and community building.</p>
              </div>
              <div style={styles.programBox}>
                <span style={styles.programNum}>4</span>
                <h4>Public Education</h4>
                <p>Educational content explaining copyright and fair use in accessible terms through guides, videos, workshops, and media outreach.</p>
              </div>
              <div style={styles.programBox}>
                <span style={styles.programNum}>5</span>
                <h4>Strategic Litigation</h4>
                <p>Multi-year strategy proceeding from test cases through circuit courts to Supreme Court review establishing DJ performances as protected fair use.</p>
              </div>
            </div>

            <p style={styles.paragraph}><strong>28.</strong> Every major technological shift has forced copyright to evolve. Player pianos prompted the 1909 Act. Radio required performance rights. VCRs established time-shifting as fair use. Now AI and algorithmic performance demand the next evolution. NRS Agenda of Music0fLaw positions DJ performances at the forefront.</p>
          </section>

          {/* Section VIII: Technology */}
          <section id="technology" style={styles.section}>
            <h2 style={styles.sectionTitle}>SECTION VIII: Technology Platform</h2>

            <p style={styles.paragraph}><strong>29.</strong> The DJ Copyright Defense Calculator represents the technological centerpiece:</p>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Component</th>
                  <th style={styles.th}>Function</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.td}>Safe Usage Calculator</td>
                  <td style={styles.td}>Analyzes performance compositions to assess fair use strength</td>
                </tr>
                <tr>
                  <td style={styles.td}>Dispute Generator</td>
                  <td style={styles.td}>Automatically generates legally-grounded dispute responses</td>
                </tr>
                <tr>
                  <td style={styles.td}>Documentation Tool</td>
                  <td style={styles.td}>Creates timestamped records of transformative elements</td>
                </tr>
                <tr>
                  <td style={styles.td}>Analytics Dashboard</td>
                  <td style={styles.td}>Tracks dispute outcomes across the DJ community</td>
                </tr>
              </tbody>
            </table>

            <p style={styles.paragraph}><strong>30.</strong> Technical infrastructure: Node.js backend, PostgreSQL database, React frontend on secure cloud infrastructure. The platform issues Transformative Use Certifications to DJs completing requirements and documenting creative practices.</p>

            <p style={styles.paragraph}><strong>31.</strong> Platform features include multi-format uploads (up to 500MB), automatic content analysis with First Amendment-compliant moderation, fair use documentation workflows, artist profiles, engagement features, and mentorship matching connecting emerging artists with practicing attorneys.</p>
          </section>

          {/* Section IX: Community */}
          <section id="community" style={styles.section}>
            <h2 style={styles.sectionTitle}>SECTION IX: Community Building</h2>

            <p style={styles.paragraph}><strong>32.</strong> The Circle Event Series combines live performance showcases with educational workshops on copyright law, fair use doctrine, and business practices.</p>

            <p style={styles.paragraph}><strong>33.</strong> Coalition partnerships will be established with electronic music organizations, DJ associations, music technology companies, and academic institutions. Target: 10+ partners Year One, growing to 50+ by Year Three.</p>

            <p style={styles.paragraph}><strong>34.</strong> The initiative is building an advisory board including entertainment law practitioners, copyright scholars, music industry professionals, and attorneys involved in significant fair use litigation—including outreach to attorneys who represented Google in Oracle.</p>

            <p style={styles.paragraph}><strong>35.</strong> <strong>International Expansion:</strong> Beginning Year Two, establishing presence in Berlin, Ibiza, Amsterdam, London, and Tokyo. International partnerships enable comparison of copyright regimes and creation of a global coalition supporting DJ rights.</p>

            <div style={styles.highlightBox}>
              <h4 style={styles.highlightTitle}>Industry Partnership Categories</h4>
              <ul style={styles.list}>
                <li>Electronic music labels and distributors</li>
                <li>DJ equipment manufacturers</li>
                <li>Music streaming platforms</li>
                <li>Music technology companies</li>
                <li>Academic institutions</li>
                <li>Civil liberties organizations</li>
              </ul>
            </div>
          </section>

          {/* Section X: Timeline */}
          <section id="timeline" style={styles.section}>
            <h2 style={styles.sectionTitle}>SECTION X: Four-Year Strategic Timeline</h2>

            <div style={styles.yearGrid}>
              <div style={styles.yearBox}>
                <h4 style={styles.yearTitle}>Year One (2025-2026)</h4>
                <ul style={styles.yearList}>
                  <li>Secure endorsement from Beatport Top 50 DJ</li>
                  <li>Launch Circle Event Series (150+ attendees)</li>
                  <li>Issue 100 Transformative Use Certifications</li>
                  <li>Establish 10+ industry partnerships</li>
                  <li>Deploy Calculator with 500+ users</li>
                </ul>
              </div>
              <div style={styles.yearBox}>
                <h4 style={styles.yearTitle}>Year Two (2026-2027)</h4>
                <ul style={styles.yearList}>
                  <li>International presence in 5+ countries</li>
                  <li>File first strategic test case</li>
                  <li>Grow certified community to 500+</li>
                  <li>Major media coverage in 3+ publications</li>
                </ul>
              </div>
              <div style={styles.yearBox}>
                <h4 style={styles.yearTitle}>Year Three (2027-2028)</h4>
                <ul style={styles.yearList}>
                  <li>Obtain favorable district court decision</li>
                  <li>Partner with major electronic festival</li>
                  <li>Grow coalition to 50+ partners</li>
                  <li>Launch legal defense fund</li>
                </ul>
              </div>
              <div style={styles.yearBox}>
                <h4 style={styles.yearTitle}>Year Four (2028-2029)</h4>
                <ul style={styles.yearList}>
                  <li>Obtain appellate court decisions</li>
                  <li>Prepare Supreme Court petition</li>
                  <li>Establish as recognized voice of DJ rights</li>
                  <li>Develop sustainability plan</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section XI: Budget */}
          <section id="budget" style={styles.section}>
            <h2 style={styles.sectionTitle}>SECTION XI: Budget & Resource Allocation</h2>

            <p style={styles.paragraph}><strong>36.</strong> Total four-year project budget: <strong>$1,932,000</strong>. Year One requires $483,000:</p>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Year One</th>
                  <th style={styles.th}>Four-Year Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.td}>Legal Advocacy & Litigation</td>
                  <td style={styles.td}>$150,000</td>
                  <td style={styles.td}>$660,000</td>
                </tr>
                <tr>
                  <td style={styles.td}>Technology Development</td>
                  <td style={styles.td}>$120,000</td>
                  <td style={styles.td}>$420,000</td>
                </tr>
                <tr>
                  <td style={styles.td}>Community Events</td>
                  <td style={styles.td}>$80,000</td>
                  <td style={styles.td}>$360,000</td>
                </tr>
                <tr>
                  <td style={styles.td}>Education & Outreach</td>
                  <td style={styles.td}>$83,000</td>
                  <td style={styles.td}>$292,000</td>
                </tr>
                <tr>
                  <td style={styles.td}>Administration</td>
                  <td style={styles.td}>$50,000</td>
                  <td style={styles.td}>$200,000</td>
                </tr>
                <tr style={styles.totalRow}>
                  <td style={{...styles.td, fontWeight: 'bold'}}>TOTAL</td>
                  <td style={{...styles.td, fontWeight: 'bold'}}>$483,000</td>
                  <td style={{...styles.td, fontWeight: 'bold'}}>$1,932,000</td>
                </tr>
              </tbody>
            </table>

            <p style={styles.paragraph}><strong>37.</strong> <strong>Sustainability Plan:</strong> Diversified funding including foundation support, individual donations, membership dues, earned revenue from certification programs, and legal fee recovery from successful litigation.</p>

            <p style={styles.paragraph}><strong>38.</strong> <strong>Risk Mitigation:</strong> Legal risk addressed through careful case selection and experienced counsel. Financial risk mitigated through diversified sources. Reputational risk managed through transparent operations. Technology risk addressed through modern infrastructure and security audits.</p>
          </section>

          {/* Section XII: Litigation */}
          <section id="litigation" style={styles.section}>
            <h2 style={styles.sectionTitle}>SECTION XII: Strategic Litigation Plan</h2>

            <p style={styles.paragraph}><strong>39.</strong> The litigation strategy proceeds through four phases:</p>

            <div style={styles.phaseGrid}>
              <div style={styles.phaseBox}>
                <h4 style={styles.phaseTitle}>Phase 1: Test Case Identification (Year 1-2)</h4>
                <p>Identify ideal plaintiff DJs with documented transformative practices, clean records, and compelling narratives. Select favorable jurisdictions with thoughtful fair use analysis history.</p>
              </div>
              <div style={styles.phaseBox}>
                <h4 style={styles.phaseTitle}>Phase 2: District Court Litigation (Year 2-3)</h4>
                <p>File strategic test cases presenting the Oracle v. Google argument. Develop evidentiary record demonstrating transformative nature of professional mixing.</p>
              </div>
              <div style={styles.phaseBox}>
                <h4 style={styles.phaseTitle}>Phase 3: Appellate Review (Year 3-4)</h4>
                <p>Appeal favorable decisions to circuit courts. Coordinate amicus brief submissions from partners. Build circuit split if necessary to attract Supreme Court attention.</p>
              </div>
              <div style={styles.phaseBox}>
                <h4 style={styles.phaseTitle}>Phase 4: Supreme Court Petition (Year 4+)</h4>
                <p>Prepare certiorari petition presenting whether Oracle's transformative use analysis applies to DJ performances. Coordinate national coalition support.</p>
              </div>
            </div>

            <p style={styles.paragraph}><strong>40.</strong> <strong>Case Selection Criteria:</strong> The ideal test case involves a DJ with extensive documentation of transformative practices, no infringement history, automated enforcement without human review, facts clearly demonstrating transformative nature, and willingness to serve as public advocate.</p>

            <p style={styles.paragraph}><strong>41.</strong> <strong>Jurisdictional Strategy:</strong> Initial cases filed in jurisdictions with favorable precedent—the Ninth Circuit (innovation-friendly decisions) and Second Circuit (entertainment law expertise) present attractive options.</p>
          </section>

          {/* Section XIII: DJ to JD */}
          <section id="pipeline" style={styles.section}>
            <h2 style={styles.sectionTitle}>SECTION XIII: The DJ to JD Pipeline</h2>

            <blockquote style={styles.blockquote}>
              "When a DJ becomes a JD, communities gain leaders."
              <cite style={styles.cite}>— NRS Agenda of Music0fLaw Vision Statement</cite>
            </blockquote>

            <p style={styles.paragraph}><strong>42.</strong> The DJ to JD Pipeline represents our educational mission: transforming young artists ages 13-24 into legally informed creators who understand, apply, and ultimately advance fair use principles.</p>

            <p style={styles.paragraph}><strong>43.</strong> <strong>The Problem:</strong> Young artists enter creative careers without understanding legal frameworks governing their work. They sample without knowing what sampling is. They remix without understanding derivative works. This ignorance makes them vulnerable to exploitation by industry players with teams of lawyers.</p>

            <p style={styles.paragraph}><strong>44.</strong> The five-stage progression:</p>

            <div style={styles.stageGrid}>
              <div style={styles.stageBox}><strong>EDUCATE</strong><br/>Build legally literate artists</div>
              <div style={styles.stageBox}><strong>ADVOCATE</strong><br/>Develop persuasive arguments</div>
              <div style={styles.stageBox}><strong>LITIGATE</strong><br/>Support test cases</div>
              <div style={styles.stageBox}><strong>LEGISLATE</strong><br/>Engage policymakers</div>
              <div style={styles.stageBox}><strong>LEAD</strong><br/>Inspire artist-attorneys</div>
            </div>

            <p style={styles.paragraph}><strong>45.</strong> <strong>Long-Term Vision:</strong> In fifteen years, alumni holding positions throughout music and legal industries—practicing entertainment law, working at labels, teaching copyright law, sitting in Congress, arguing before the Supreme Court.</p>
          </section>

          {/* Section XIV: Curriculum */}
          <section id="curriculum" style={styles.section}>
            <h2 style={styles.sectionTitle}>SECTION XIV: Curriculum Framework</h2>

            <p style={styles.paragraph}><strong>46.</strong> The educational curriculum combines music creation with legal literacy:</p>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Module</th>
                  <th style={styles.th}>Content</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.td}>Copyright Fundamentals</td>
                  <td style={styles.td}>What copyright protects, duration, registration, ownership</td>
                </tr>
                <tr>
                  <td style={styles.td}>Fair Use Deep Dive</td>
                  <td style={styles.td}>Four-factor test, transformative use, landmark cases</td>
                </tr>
                <tr>
                  <td style={styles.td}>Music Industry Contracts</td>
                  <td style={styles.td}>Recording agreements, publishing, sync licenses</td>
                </tr>
                <tr>
                  <td style={styles.td}>Platform Terms</td>
                  <td style={styles.td}>YouTube, Twitch, SoundCloud policies and disputes</td>
                </tr>
                <tr>
                  <td style={styles.td}>Business Formation</td>
                  <td style={styles.td}>LLCs, tax implications, structuring creative business</td>
                </tr>
                <tr>
                  <td style={styles.td}>Law School Prep</td>
                  <td style={styles.td}>LSAT preparation, application strategies</td>
                </tr>
              </tbody>
            </table>

            <p style={styles.paragraph}><strong>47.</strong> <strong>Certification Pathway:</strong> Participants demonstrating mastery earn Transformative Use Certification with documentation, advanced platform access, priority dispute support, and directory listing.</p>

            <p style={styles.paragraph}><strong>48.</strong> <strong>Replication Model:</strong> Curriculum developed for replication by nonprofit arts organizations, law school clinics, public libraries, and school districts—institutionalizing copyright literacy for future generations.</p>
          </section>

          {/* Section XV: Prayer for Relief */}
          <section id="relief" style={styles.section}>
            <h2 style={styles.sectionTitle}>SECTION XV: Prayer for Relief</h2>

            <p style={styles.paragraph}><strong>WHEREFORE</strong>, NRS Agenda of Music0fLaw respectfully requests that this Court of Public Opinion, and ultimately the Supreme Court of the United States, recognize:</p>

            <ol style={styles.orderedList}>
              <li>That electronic DJ performances constitute protected transformative fair use under 17 U.S.C. § 107 as interpreted by <em>Oracle America, Inc. v. Google LLC</em>;</li>
              <li>That automated copyright enforcement systems failing to distinguish transformative performances from piracy violate fair use rights;</li>
              <li>That the creative contributions of DJs deserve the same legal recognition afforded to all transformative artists throughout American history.</li>
            </ol>

            <p style={styles.paragraph}><strong>49.</strong> Specifically, NRS Agenda of Music0fLaw seeks:</p>

            <ul style={styles.list}>
              <li><strong>(A)</strong> Judicial declaration that professional DJ performances constitute transformative fair use when adding substantial creative contribution;</li>
              <li><strong>(B)</strong> Judicial declaration that automated Content ID systems violate fair use rights when suppressing content without human review;</li>
              <li><strong>(C)</strong> Injunctive relief requiring major platforms to implement fair use analysis before enforcing claims against DJ content;</li>
              <li><strong>(D)</strong> Statutory damages under 17 U.S.C. § 512(f) for knowing misrepresentation in takedown notices targeting transformative content;</li>
              <li><strong>(E)</strong> Such other relief as this Court deems just and proper.</li>
            </ul>

            <p style={styles.paragraph}><strong>50.</strong> <strong>The Broader Vision:</strong> Copyright should enable creative expression, not suppress it. Artists who transform existing works deserve legal protection, not liability. The law must evolve alongside technology. When a DJ becomes a JD, communities gain leaders who can advocate for these principles from positions of legal authority.</p>
          </section>

          {/* Section XVI: Contact */}
          <section id="contact" style={styles.section}>
            <h2 style={styles.sectionTitle}>SECTION XVI: Verification & Contact</h2>

            <p style={styles.paragraph}>I, Nigel A. Marin, J.D., declare under penalty of perjury that the foregoing is true and correct to the best of my knowledge, information, and belief.</p>

            <div style={styles.signature}>
              <p>Respectfully submitted,</p>
              <p style={styles.signatureName}>Nigel A. Marin, J.D.</p>
              <p>Founder and Principal<br/>NRS Agenda of Music0fLaw</p>
              <p style={styles.signatureAddress}>
                1690 W. Shaw Ave, 2nd Floor, Suite 220<br/>
                Fresno, California 93711<br/>
                Tel: (559) 894-2003<br/>
                Email: legal@nrsgroupfresno.com
              </p>
              <p><strong>Date: December 6, 2025</strong></p>
            </div>

            <div style={styles.disclaimer}>
              <h4>Important Disclaimer</h4>
              <p>NRS Agenda of Music0fLaw provides legal advocacy and education services. Nigel A. Marin, J.D. is a California Bar Candidate who sat for the July 2025 examination with results pending. Until bar admission, services constitute business consulting and education, not legal representation. For legal advice, consult a licensed attorney.</p>
            </div>
          </section>

          {/* Join Section */}
          <section id="join" style={styles.joinSection}>
            <h2 style={styles.joinTitle}>JOIN THE COALITION</h2>
            <p style={styles.joinSubtitle}>How You Can Support This Initiative</p>

            <div style={styles.joinGrid}>
              <div style={styles.joinBox}>
                <h4 style={styles.joinBoxTitle}>For DJs & Electronic Artists</h4>
                <ul style={styles.joinList}>
                  <li>Register for the DJ Copyright Defense Calculator</li>
                  <li>Attend Circle Events to connect with the community</li>
                  <li>Pursue Transformative Use Certification</li>
                  <li>Share your stories of automated enforcement</li>
                  <li>Consider whether your experience might serve as a test case</li>
                </ul>
                <a href="mailto:legal@nrsgroupfresno.com?subject=DJ%20Registration" style={styles.joinBoxButton}>Register Now</a>
              </div>

              <div style={styles.joinBox}>
                <h4 style={styles.joinBoxTitle}>For Industry Professionals</h4>
                <ul style={styles.joinList}>
                  <li>Join the coalition as an industry partner</li>
                  <li>Provide expertise on music industry economics</li>
                  <li>Connect us with artists who have compelling stories</li>
                  <li>Support educational programming through sponsorship</li>
                </ul>
                <a href="mailto:legal@nrsgroupfresno.com?subject=Industry%20Partnership" style={styles.joinBoxButton}>Become a Partner</a>
              </div>

              <div style={styles.joinBox}>
                <h4 style={styles.joinBoxTitle}>For Attorneys</h4>
                <ul style={styles.joinList}>
                  <li>Join the advisory board to guide legal strategy</li>
                  <li>Contribute to amicus brief development</li>
                  <li>Mentor DJ to JD Pipeline participants</li>
                  <li>Consider pro bono representation for test cases</li>
                </ul>
                <a href="mailto:legal@nrsgroupfresno.com?subject=Attorney%20Advisory%20Board" style={styles.joinBoxButton}>Join Advisory Board</a>
              </div>

              <div style={styles.joinBox}>
                <h4 style={styles.joinBoxTitle}>For Funders</h4>
                <ul style={styles.joinList}>
                  <li>Support Year One budget of $483,000</li>
                  <li>Consider multi-year commitments for strategic planning</li>
                  <li>Fund specific program areas aligned with your mission</li>
                  <li>Invest in systemic change benefiting artists for generations</li>
                </ul>
                <a href="mailto:legal@nrsgroupfresno.com?subject=Funding%20Inquiry" style={styles.joinBoxButton}>Fund the Initiative</a>
              </div>
            </div>

            <div style={styles.finalStatement}>
              <p>The electronic music community stands at a crossroads. If we act—build legal frameworks, develop documentation systems, file strategic cases, and train artist-attorneys—we can secure recognition of DJ rights denied for too long.</p>
              <p style={styles.finalBold}>The time is now. The precedent exists in Oracle v. Google. The community is ready.</p>
              <p>Updates at <strong>Techno-Agenda.com</strong> and <strong>NRSGroupFresno.com</strong></p>
            </div>
          </section>

          {/* Footer */}
          <footer style={styles.footer}>
            <p>© 2025 NRS Agenda of Music0fLaw | A 501(c)(3) Nonprofit Organization</p>
            <p>Media inquiries: legal@nrsgroupfresno.com</p>
          </footer>

        </article>
      </main>
    </>
  );
}

const styles = {
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '280px',
    height: '100vh',
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    padding: '20px',
    overflowY: 'auto',
    borderRight: '3px solid #c9a227',
    zIndex: 1000,
  },
  sidebarHeader: {
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #333',
  },
  caseNum: {
    fontSize: '11px',
    color: '#c9a227',
    letterSpacing: '1px',
    display: 'block',
    marginBottom: '8px',
  },
  sidebarTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    margin: 0,
  },
  navSections: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  navGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  navGroupTitle: {
    fontSize: '10px',
    color: '#c9a227',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  navLink: {
    fontSize: '12px',
    color: '#ccc',
    textDecoration: 'none',
    padding: '4px 8px',
    borderRadius: '3px',
    transition: 'all 0.2s',
  },
  joinCTA: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #333',
  },
  joinButton: {
    display: 'block',
    backgroundColor: '#c9a227',
    color: '#1a1a2e',
    padding: '12px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '12px',
    letterSpacing: '1px',
    borderRadius: '4px',
  },
  main: {
    marginLeft: '280px',
    backgroundColor: '#f5f5f0',
    minHeight: '100vh',
  },
  document: {
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 40px rgba(0,0,0,0.1)',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    padding: '60px 50px',
    textAlign: 'center',
    borderBottom: '5px solid #c9a227',
  },
  courtHeader: {
    marginBottom: '30px',
  },
  courtText: {
    fontSize: '14px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    margin: '5px 0',
    color: '#999',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    letterSpacing: '4px',
    marginBottom: '15px',
    color: '#c9a227',
  },
  subtitle: {
    fontSize: '16px',
    fontStyle: 'italic',
    marginBottom: '30px',
    color: '#ccc',
    maxWidth: '600px',
    margin: '0 auto 30px',
  },
  orgInfo: {
    fontSize: '12px',
    letterSpacing: '1px',
    marginBottom: '30px',
    color: '#999',
  },
  parties: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '30px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  party: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  partyLabel: {
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#c9a227',
    marginBottom: '5px',
  },
  partyName: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
  vsBox: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#c9a227',
  },
  caseNumber: {
    backgroundColor: '#c9a227',
    color: '#1a1a2e',
    padding: '10px 30px',
    display: 'inline-block',
    fontWeight: 'bold',
    letterSpacing: '2px',
    fontSize: '14px',
  },
  section: {
    padding: '50px',
    borderBottom: '1px solid #e0e0e0',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '2px solid #c9a227',
    letterSpacing: '1px',
  },
  paragraph: {
    fontSize: '15px',
    lineHeight: '1.8',
    marginBottom: '20px',
    color: '#333',
    textAlign: 'justify',
  },
  infoBox: {
    backgroundColor: '#f8f8f5',
    border: '1px solid #ddd',
    padding: '25px',
    marginBottom: '25px',
    borderLeft: '4px solid #c9a227',
  },
  infoBoxTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#1a1a2e',
  },
  highlightBox: {
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    padding: '30px',
    marginBottom: '25px',
    borderRadius: '4px',
  },
  highlightTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#c9a227',
  },
  list: {
    paddingLeft: '25px',
    marginBottom: '20px',
    lineHeight: '1.8',
  },
  orderedList: {
    paddingLeft: '25px',
    marginBottom: '20px',
    lineHeight: '2',
  },
  blockquote: {
    borderLeft: '4px solid #c9a227',
    paddingLeft: '25px',
    margin: '30px 0',
    fontStyle: 'italic',
    fontSize: '16px',
    color: '#555',
  },
  cite: {
    display: 'block',
    marginTop: '10px',
    fontSize: '13px',
    color: '#888',
    fontStyle: 'normal',
  },
  timeline: {
    margin: '30px 0',
  },
  timelineItem: {
    display: 'flex',
    gap: '20px',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee',
  },
  timelineYear: {
    fontWeight: 'bold',
    color: '#c9a227',
    minWidth: '60px',
  },
  factorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '30px',
  },
  factorBox: {
    backgroundColor: '#f8f8f5',
    padding: '25px',
    border: '1px solid #ddd',
  },
  factorTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '10px',
  },
  programGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  programBox: {
    backgroundColor: '#f8f8f5',
    padding: '25px',
    border: '1px solid #ddd',
    position: 'relative',
  },
  programNum: {
    position: 'absolute',
    top: '-10px',
    left: '20px',
    backgroundColor: '#c9a227',
    color: '#1a1a2e',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    borderRadius: '50%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '25px',
  },
  th: {
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    padding: '15px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  td: {
    padding: '15px',
    borderBottom: '1px solid #ddd',
    fontSize: '14px',
  },
  totalRow: {
    backgroundColor: '#f8f8f5',
  },
  yearGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '30px',
  },
  yearBox: {
    backgroundColor: '#f8f8f5',
    padding: '25px',
    border: '1px solid #ddd',
  },
  yearTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#c9a227',
    marginBottom: '15px',
  },
  yearList: {
    paddingLeft: '20px',
    margin: 0,
    lineHeight: '1.8',
    fontSize: '14px',
  },
  phaseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '30px',
  },
  phaseBox: {
    backgroundColor: '#f8f8f5',
    padding: '25px',
    border: '1px solid #ddd',
    borderTop: '4px solid #c9a227',
  },
  phaseTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '10px',
  },
  stageGrid: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  stageBox: {
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    padding: '20px',
    textAlign: 'center',
    flex: '1',
    minWidth: '120px',
  },
  signature: {
    marginTop: '40px',
    textAlign: 'center',
  },
  signatureName: {
    fontSize: '20px',
    fontStyle: 'italic',
    margin: '20px 0',
  },
  signatureAddress: {
    fontSize: '14px',
    color: '#666',
    marginTop: '20px',
  },
  disclaimer: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
    padding: '25px',
    marginTop: '40px',
    borderRadius: '4px',
  },
  joinSection: {
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    padding: '60px 50px',
  },
  joinTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '10px',
    color: '#c9a227',
    letterSpacing: '3px',
  },
  joinSubtitle: {
    fontSize: '16px',
    textAlign: 'center',
    marginBottom: '40px',
    color: '#ccc',
  },
  joinGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '25px',
    marginBottom: '40px',
  },
  joinBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: '30px',
    border: '1px solid #333',
    borderRadius: '4px',
  },
  joinBoxTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#c9a227',
  },
  joinList: {
    paddingLeft: '20px',
    marginBottom: '20px',
    lineHeight: '1.8',
    fontSize: '14px',
  },
  joinBoxButton: {
    display: 'inline-block',
    backgroundColor: '#c9a227',
    color: '#1a1a2e',
    padding: '10px 25px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '12px',
    letterSpacing: '1px',
    borderRadius: '4px',
  },
  finalStatement: {
    textAlign: 'center',
    maxWidth: '700px',
    margin: '0 auto',
    padding: '30px',
    borderTop: '1px solid #333',
  },
  finalBold: {
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#c9a227',
    margin: '20px 0',
  },
  footer: {
    backgroundColor: '#111',
    color: '#666',
    padding: '30px 50px',
    textAlign: 'center',
    fontSize: '12px',
  },
};
