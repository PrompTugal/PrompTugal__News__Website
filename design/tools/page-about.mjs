// The RiskMandate page and the about page with the editors' masthead box.
import { page, NAME, LIVE } from './lib.mjs'

export function riskmandatePage(file) {
    const body = `
<div class="art-head" style="max-width:var(--measure);margin:0 auto">
<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="about.html">About</a> / RiskMandate</nav>
<p class="kicker">About PrompTugal.news</p>
<h1>Powered by RiskMandate</h1>
<p class="lead">What the line under our name means, in plain words, and what RiskMandate says it is, in its own words.</p>
</div>
<div class="body" style="max-width:var(--measure);margin:0 auto">
<h2 id="means">What it means here</h2>
<ul>
<li><strong>Our lens comes from RiskMandate.</strong> We ask three questions of every AI agent we write about: what can it reach, what was it asked to do, and who controls the gap. That framing is RiskMandate's.</li>
<li><strong>The same team.</strong> The people who make PrompTugal.news also work on RiskMandate. That is an interest, and <a href="about.html#interest">our disclosure</a> says so before anything else.</li>
<li><strong>Independent of Web Summit, not of RiskMandate.</strong> We have no affiliation with Web Summit. We do have one with RiskMandate, and we never hide it.</li>
<li><strong>No claim beyond its own words.</strong> Everything this site says about RiskMandate is quoted from riskmandate.ai, with the date we read it.</li>
</ul>
<h2 id="own-words">RiskMandate, in its own words</h2>
<div class="endorse-card">
<div><img class="lockup on-light" src="https://riskmandate.ai/assets/brand/riskmandate-lockup-light.svg" alt="RiskMandate" width="160" height="32"><img class="lockup on-dark" src="https://riskmandate.ai/assets/brand/riskmandate-lockup-dark.svg" alt="RiskMandate" width="160" height="32"><p class="meta">The lockup as RiskMandate publishes it on its <a href="https://riskmandate.ai/brand.html">brand page</a>, shown unchanged.</p></div>
<div><blockquote><p>"RiskMandate creates and sells Agent Behaviour Policies. For one agent in one deployment, a portable record of everything it can actually reach, what you authorised it to do, and the gap between the two, fitted to a twin of the deployment it actually runs in."</p></blockquote>
<ul class="chips"><li><a class="chip src" href="https://riskmandate.ai/summit-booth.html">riskmandate.ai · read 5 Nov</a></li></ul></div>
</div>
<h2 id="lens">The question we borrow</h2>
<ol class="lens"><li><b>Reach</b>What can the agent actually do?</li><li><b>Mandate</b>What was it authorised and expected to do?</li><li><b>Gap</b>Who controls the difference?</li></ol>
<blockquote><p>"A grant is what a credential technically permits, a mandate is what the holder is authorised and expected to do, and the gap between them is exposure nobody ever accepted."</p></blockquote>
<ul class="chips"><li><a class="chip src" href="https://riskmandate.ai/llms.txt">riskmandate.ai/llms.txt · read 4 Nov</a></li></ul>
<p>We ask our own agent the same questions first: <a href="about.html#our-agent">its reach, mandate and gap</a> are on the about page.</p>
<h2 id="more">Read more</h2>
<ul><li><a href="https://riskmandate.ai/">riskmandate.ai</a>, its own site</li><li><a href="https://riskmandate.ai/abp.html">The Agent Behaviour Policy</a>, in its words</li><li><a href="https://riskmandate.ai/llms.txt">llms.txt</a>, for agents</li></ul>
<p class="notice">RiskMandate's name, mark and colours are its own. We show its lockup as published and never redraw or recolour it, and our own colours stay apart from its green.</p>
</div>`
    return page({ file, title: 'Powered by RiskMandate', section: 'About', body, mock: 'the RiskMandate page that "Powered by RiskMandate" links to. Every line about RiskMandate is quoted from riskmandate.ai with the date read; the lockup is loaded from riskmandate.ai, not redrawn.' })
}

export function aboutPage(file) {
    const body = `
<div style="max-width:var(--measure);margin:0 auto">
<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / About</nav>
<h1>About PrompTugal.news</h1>
<p class="lead">${NAME}: technology and AI, in context, from Portugal for Europe; its first edition is Web Summit Lisbon 2026: what is on, who is there, and what is new, for the people at the summit. Every fact sourced and dated.</p>
<section class="staffbox" aria-labelledby="mh"><h2 id="mh">The masthead</h2>
<dl>
<div class="wide"><dt>Editor-in-chief</dt><dd>Dinis Cruz<small>decides what PrompTugal.news says, approves every major release</small></dd></div>
<div><dt>Editor</dt><dd>Indi<small>what we publish, and how it reads</small></dd></div>
<div><dt>Editor</dt><dd>Vicky<small>research and the programme</small></dd></div>
<div class="wide agents"><dt>The agent desks</dt><dd>newsroom@web-summit.dinis, publishes and signs · programme@web-summit.vicky, the agenda · curator@web-summit.vicky, the story map · the researcher, four runs a day · newsroom-designer@web-summit.dinis, the design</dd></div>
</dl></section>
<div class="notice brand"><p style="margin:0 0 6px"><strong class="independence">Independent. Not affiliated with Web Summit.</strong></p><p style="margin:0">We report from Web Summit Lisbon; we are not part of it, and nothing here speaks for it. We use its name only to say where we are, and never its logo, colours or style.</p></div>
<div class="body">
<h2 id="interest">Our interest</h2>
<p>The team that makes PrompTugal.news also works on <a href="riskmandate.html">RiskMandate</a>, which sells Agent Behaviour Policies. So we are independent of Web Summit, but not of RiskMandate. We may write about companies the team hopes to meet or sell to. Please weigh what we say with that in mind.</p>
<h2 id="rules">Our rules</h2>
<ul><li>We publish only facts we can source, each linked to a public page with the date we read it.</li><li>We leave out anything we are unsure of, and say so.</li><li>Nothing about a person that is not already public and professional, and never contact details.</li><li>No claim for RiskMandate beyond its own words.</li></ul>
<h2 id="corrections">Corrections</h2>
<p>Anyone can ask for a correction. We publish it on the page it corrects, dated, with the old text left visible. A correction request is welcome, not a problem.</p>
<h2 id="our-agent">Our own agent's reach, mandate and gap</h2>
<div class="table"><table><tbody>
<tr><td>Reach</td><td>Changes the site's development branch; reads public pages and code; signs articles with its own session key.</td></tr>
<tr><td>Mandate</td><td>Build and run PrompTugal.news; publish only sourced facts; never touch the main branch or publish a key or a contact detail.</td></tr>
<tr><td>Gap</td><td>A change to the development branch goes live with no human review first. The automatic check is the only barrier, and it checks form, not truth.</td></tr>
</tbody></table></div>
<h2 id="how">How we make it</h2>
<p>Pages are plain text, built by one script with no dependencies, checked before anything goes live, numbered by the system rather than by people, and signed. Every page has a plain-text twin for AI agents. <a href="https://github.com/SGit-AI/SGit-AI__Website__Newsroom__Web-Summit">The source code</a> is public.</p>
</div>
</div>`
    return page({ file, title: 'About PrompTugal.news', section: 'About', body, mock: 'the about page with the editors\' masthead box, the independence line and the disclosure. Editors\' role lines follow brief 4\'s proposal and wait on Dinis.' })
}
