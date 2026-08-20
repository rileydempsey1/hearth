import type { Playbook } from './playbook-types';

export const PLAYBOOKS_PRO: Playbook[] = [
  {
    id: 'feedback-lands',
    title: 'Give feedback that actually lands',
    deck: 'Most feedback fails at the framing, not the content.',
    category: 'Communication',
    minutes: 7,
    pro: true,
    icon: 'message-square',
    hue: 'ember',
    gist: 'Observation, impact, request — and never more than one of each.',
    sections: [
      {
        heading: 'The three-part sentence',
        body: "Observation: the specific thing that happened, stripped of interpretation. Impact: what it caused, ideally something you witnessed rather than assumed. Request: the concrete different thing you want next time.\n\n'In the client call you answered the pricing question before Ana finished hers. The client dropped her thread and we never got back to it. Next time, hold your answer until she lands hers.' That is the whole technique. It works because there is nothing in it to argue with — the observation is factual, the impact is observable, and the request is small enough to actually do.",
      },
      {
        heading: 'Strip the character judgement',
        body: "'You were dismissive' is an inference about who someone is. 'You answered over Ana' is a description of what someone did. The first invites a defence of their identity; the second invites a change of behaviour.\n\nThis is not softening. The description is often harder to hear, because it is harder to deny. But it leaves the person somewhere to go, and a defended person cannot go anywhere.",
      },
      {
        heading: 'Compliment sandwiches fool nobody',
        body: "Wrapping criticism in praise teaches people that your praise is a warning sign. Within a month, every compliment you give is heard as a preamble and discounted.\n\nGive praise when you mean it, on its own, specific. Give criticism on its own, specific. Both land harder when they are not being used as packaging for each other.",
      },
      {
        heading: 'Timing beats eloquence',
        body: "Feedback given within a day, roughly phrased, outperforms feedback given in three weeks, beautifully phrased. Memory decays and the person has already repeated the behaviour four times.\n\nThe exception is heat. If either of you is still hot, wait — but wait hours, not weeks, and schedule it rather than hoping for a moment.",
      },
      {
        heading: 'Ask before you conclude',
        body: "You are seeing one frame of a longer film. 'You skipped the review step' might be 'the review step was blocked and I flagged it in a thread you were not in'.\n\nOpen with a question when you can: 'I noticed the review step got skipped on this one — what happened?' If your read was right, nothing is lost. If it was wrong, you just avoided burning a chunk of trust on a story you invented.",
      },
    ],
    steps: [
      'One observation, factual, no adjectives about the person',
      'One impact, ideally something you saw',
      'One request, small and concrete',
      'Deliver within a day, in private, in person or on a call',
      'Ask what happened before you conclude what happened',
    ],
    template: {
      title: 'Feedback note',
      body: 'OBSERVATION — In yesterday\'s review you rewrote Sam\'s section directly in the doc without commenting first.\n\nIMPACT — Sam spent an hour trying to work out what changed and why, and did not raise it because it looked settled.\n\nREQUEST — For the next round, leave comments instead of edits on other people\'s sections.\n\nASK FIRST — Was there a reason to edit directly? Deadline pressure would explain it.',
    },
    pitfalls: [
      'Saving it all for a review cycle',
      'Adjectives about the person instead of verbs about the action',
      'Delivering three pieces of feedback in one sitting',
      'Praise used as packaging',
    ],
  },
  {
    id: 'disagree-well',
    title: 'Disagree without burning the room',
    deck: 'The goal is to change the decision, not to win the exchange.',
    category: 'Communication',
    minutes: 6,
    pro: true,
    icon: 'git-branch',
    hue: 'ember',
    gist: 'State their case better than they did, then say the one thing they missed.',
    sections: [
      {
        heading: 'Steelman first, out loud',
        body: "Before you object, say back the strongest version of the other position — better than they said it. 'The case for shipping now is that we lose the quarter otherwise, and the bugs we know about only affect a tenth of accounts. That is a real argument.'\n\nThis costs you thirty seconds and buys you the room. Nobody defends against someone who has already understood them, and you will occasionally discover mid-sentence that they were right.",
      },
      {
        heading: 'Disagree with one thing',
        body: "The instinct under pressure is to list every objection at once. It reads as opposition rather than analysis, and it lets the other side pick off your weakest point and treat the whole thing as answered.\n\nPick the objection that, if resolved, would change the decision. Lead with it. Hold the rest.",
      },
      {
        heading: 'Name what would change your mind',
        body: "'I would be fine with shipping if we had a rollback that takes under ten minutes' turns a disagreement into a task. It also proves you are arguing in good faith, because you have described the conditions under which you would stop.\n\nIf you cannot name what would change your mind, you are not disagreeing about the decision. You are disagreeing about something else, and it is worth finding out what.",
      },
      {
        heading: 'Commit visibly when it goes the other way',
        body: "Disagree and commit is worth nothing if the commit is silent and grudging. Say it in the same room where you disagreed: 'I still think this is a risk, and I am fully behind it. Here is what I will do to reduce the downside.'\n\nThat sentence is why people will keep letting you into the room to disagree. Withhold it and you get invited to fewer rooms, which is the actual cost of being right in an unpleasant way.",
      },
    ],
    steps: [
      'Say their case back, stronger than they said it',
      'Raise the one objection that would change the outcome',
      'Name the condition that would satisfy you',
      'Separate the decision from the person making it',
      'If it goes the other way, commit out loud and in writing',
    ],
    template: {
      title: 'Dissent note',
      body: 'THE CASE FOR — Shipping in March protects the quarter and the known bugs touch under 10% of accounts.\n\nMY ONE OBJECTION — Those 10% are the enterprise accounts, which is 60% of revenue and all of the renewals in April.\n\nWHAT WOULD CHANGE MY MIND — A flag that lets us turn the new flow off for enterprise accounts specifically, inside ten minutes.\n\nIF WE SHIP ANYWAY — I am in. I will own the rollback runbook and be on call for the first week.',
    },
    pitfalls: [
      'Listing every objection you have',
      'Arguing to be seen arguing',
      'Silent, resentful compliance afterwards',
      'Making it about the person’s judgement rather than the decision',
    ],
  },
  {
    id: 'meeting-as-note',
    title: 'The meeting that should have been a note',
    deck: 'A test for which meetings to kill, and how to kill them without drama.',
    category: 'Meetings',
    minutes: 6,
    pro: true,
    icon: 'calendar',
    hue: 'iris',
    gist: 'If no decision is possible and no relationship is being built, write it instead.',
    sections: [
      {
        heading: 'The two-question test',
        body: "Is a decision going to be made that cannot be made in writing? Is a relationship being built that cannot be built in writing?\n\nIf both answers are no, the meeting is an expensive way to read something aloud. Meetings are for the things that need real-time back-and-forth — genuine disagreement, ambiguity that needs several rounds, and the human parts. Everything else is a document with a calendar invite attached.",
      },
      {
        heading: 'Cost it once, honestly',
        body: "A weekly hour with eight people is more than four hundred hours a year. Say that number out loud when you propose killing it. It changes the conversation from a preference to an arithmetic problem.\n\nMost recurring meetings would not survive being proposed fresh today. They survive because cancelling requires someone to act and continuing requires nobody to.",
      },
      {
        heading: 'Kill it as an experiment',
        body: "Do not cancel the meeting. Pause it for three weeks and replace it with a written update on the same cadence, and say explicitly that it comes back if anything breaks.\n\nFraming it as reversible removes the politics. In practice almost nothing breaks, and after three weeks nobody wants it back — but they had to find that out rather than be told.",
      },
      {
        heading: 'Replace it with something real',
        body: "A killed meeting leaves a coordination hole. If you do not fill it, the hole fills itself with drive-by messages, which are worse.\n\nThe replacement is usually a written update posted on a fixed day, in a fixed place, in a fixed shape, with an agreed window for replies. Fixed is the operative word: the reason meetings work at all is that they are predictable, and your replacement has to be too.",
      },
    ],
    steps: [
      'Run the two-question test on every recurring invite you own',
      'Compute the annual hours and say it out loud',
      'Pause for three weeks rather than cancelling',
      'Replace it with a written update on the same cadence',
      'Give the written version a fixed day, place and shape',
    ],
    template: {
      title: 'Pause proposal',
      body: 'MEETING — Weekly platform sync. 8 people, 1 hour, 416 hours a year.\n\nTEST — No decisions have been made in it in the last six weeks. Everything in it has been status.\n\nPROPOSAL — Pause for three weeks starting Monday. Replaced by a written update in this space every Monday by 11am, same headings we use verbally, replies by Tuesday noon.\n\nREVERSIBLE — If anything gets missed, we put it straight back and I will say so publicly.',
    },
    pitfalls: [
      'Cancelling outright and triggering a political fight',
      'Removing the meeting without replacing the coordination',
      'A written replacement with no fixed day or shape',
      'Keeping it because "people like it" without asking them',
    ],
  },
  {
    id: 'retro',
    title: 'Facilitate a retro people look forward to',
    deck: 'A retro without a change is a support group with a whiteboard.',
    category: 'Meetings',
    minutes: 8,
    pro: true,
    icon: 'refresh-ccw',
    hue: 'iris',
    gist: 'Gather silently, cluster, pick one thing, assign it, and check it next time.',
    sections: [
      {
        heading: 'Silent gathering beats round-robin',
        body: "Open with eight minutes of silent writing — everyone puts their items down at once, without hearing anyone else first. Then read them out.\n\nRound-robin discussion anchors the room on whatever the first confident person said. Silent gathering gets you the quiet person's observation, which is frequently the one that matters, and it takes less time than going around the table.",
      },
      {
        heading: 'Cluster before you discuss',
        body: "Group the items into themes before opening the floor. Six items that are all versions of 'we did not know who owned this' become one theme, and the theme is far more actionable than any of the six.\n\nDo the clustering visibly and let people move things. It takes four minutes and it converts a list of complaints into a diagnosis.",
      },
      {
        heading: 'One change, one owner, one date',
        body: "The most common retro failure is generating twelve action items and completing none. Pick one. The one with the best ratio of impact to effort, decided by the room, owned by a named person, due before the next retro.\n\nOne completed change per retro is roughly twenty changes a year. Twelve abandoned ones is zero, and it also teaches the team that retros do not produce change — which is how retros die.",
      },
      {
        heading: 'Open with last time',
        body: "Every retro starts by looking at the previous change: did it happen, did it help. Two minutes.\n\nThis single habit is what separates retros that improve things from retros that are a venting ritual. It creates accountability without anyone having to be the enforcer, because the check is built into the format.",
      },
      {
        heading: 'Protect the safety, deliberately',
        body: "If the most senior person speaks first, you will get a retro about what the most senior person already believes. They should speak last, and should be the one to name their own mistake first if there is one to name.\n\nWhen something goes wrong, the facilitator's job is to keep the conversation on the system rather than the person. 'What made that easy to get wrong?' is the question that does it.",
      },
    ],
    steps: [
      'Two minutes: did last retro’s change happen, did it help',
      'Eight minutes: silent writing, everyone at once',
      'Four minutes: cluster into themes, let people move items',
      'Fifteen minutes: discuss the top two themes only',
      'Five minutes: pick one change, one owner, one date',
    ],
    template: {
      title: 'Retro record',
      body: 'LAST TIME — "Post the deploy plan the day before." Happened 3 of 4 times. Helped: two fewer surprise rollbacks.\n\nTHEMES\n1. Ownership was unclear on anything touching billing (6 items)\n2. Staging drifted from production again (4 items)\n3. Good: the on-call handover doc worked (3 items)\n\nTHE ONE CHANGE — Every billing-adjacent ticket gets a named owner at grooming, not at pickup.\nOWNER — Marcus. BY — next retro.',
    },
    pitfalls: [
      'Twelve action items and no owners',
      'The most senior person speaking first',
      'Never checking whether the last change happened',
      'Discussing every theme instead of the top two',
    ],
  },
  {
    id: 'one-on-one',
    title: 'The 1:1 that is not a status report',
    deck: 'You already know the status. Use the half hour for what you do not know.',
    category: 'Meetings',
    minutes: 7,
    pro: true,
    icon: 'coffee',
    hue: 'iris',
    gist: 'Their agenda first, one real question, and something written down at the end.',
    sections: [
      {
        heading: 'Their agenda, not yours',
        body: "The default failure mode is the manager arriving with a list. That converts the only recurring private conversation the two of you have into a second standup.\n\nOpen with 'what is on your list?' and actually wait. If the answer is nothing, sit in the silence for a beat rather than filling it — people who say 'nothing much' at second 2 often say the real thing at second 8.",
      },
      {
        heading: 'One question that is not about work in flight',
        body: "Rotate through a small set. What is the most frustrating part of your week right now? What would you do differently if this were your team? What are you learning? Who has helped you recently that I have not noticed?\n\nAsk one, not four. The value comes from the follow-up questions, and you only have time to follow up on one.",
      },
      {
        heading: 'Say the quiet thing about performance',
        body: "The single most damaging 1:1 pattern is a year of pleasant conversations followed by a surprising review. If there is a gap, it must be named early, plainly, and more than once.\n\nOne sentence is enough: 'I want to be direct — the thing that would move you to the next level is X, and right now I do not see it consistently.' Then spend the rest of the time on how, not whether.",
      },
      {
        heading: 'Write three lines afterwards',
        body: "What they raised, what you committed to, what to follow up on next time. In a place you both can see.\n\nThis is what turns thirty scattered conversations a year into a record. It also means that when you write a review or a promotion case, you are drawing on evidence rather than on the last six weeks, which is the single biggest source of unfair reviews.",
      },
    ],
    steps: [
      'Open with their list and wait out the first silence',
      'Ask one question that is not about work in flight',
      'Name any performance gap plainly, early, and more than once',
      'Close by stating what you will do before next time',
      'Write three lines in a shared place',
    ],
    template: {
      title: '1:1 log',
      body: 'THEY RAISED — Feels stuck between the platform work and the customer work; neither feels finished.\n\nWE DISCUSSED — Dropping the platform work for six weeks rather than splitting. They were relieved, which tells me it had been on their mind a while.\n\nI COMMITTED TO — Talking to Dana about reassigning the platform tickets by Friday.\n\nNEXT TIME — Ask how the six weeks is going, and revisit the promotion conversation from Feb.',
    },
    pitfalls: [
      'Arriving with your own agenda first',
      'Cancelling it when the week is busy',
      'Storing everything in your head instead of in writing',
      'A year of pleasant chats and a surprising review',
    ],
  },
  {
    id: 'decision-doc',
    title: 'The decision doc',
    deck: 'Write the decision down or relitigate it every eight weeks forever.',
    category: 'Projects',
    minutes: 7,
    pro: true,
    icon: 'flag',
    hue: 'mint',
    gist: 'Decision, date, decider, options considered, and what would reverse it.',
    sections: [
      {
        heading: 'What it costs not to have one',
        body: "An undocumented decision gets remade. Not once — repeatedly, every time someone new joins or someone old forgets. Each remake costs a meeting and a little trust, because half the room is sure this was settled and cannot prove it.\n\nA decision doc is fifteen minutes of writing against several hours a year of relitigation. It is close to the highest-return writing there is.",
      },
      {
        heading: 'Record the options you rejected',
        body: "The rejected options are the most valuable part and the part people skip. Six months later, someone will propose the thing you already rejected, and without the record you have no way to distinguish 'we thought about that' from 'we never considered it'.\n\nOne line each is enough: the option, and the single reason it lost.",
      },
      {
        heading: 'Write down what would reverse it',
        body: "Every decision is conditional on something. Name it. 'We are building this ourselves because no vendor supports multi-region. If one ships that, we should revisit.'\n\nThis does two things: it makes the decision honest about its own assumptions, and it gives future-you a tripwire instead of a vague sense that things might have changed.",
      },
      {
        heading: 'One decider, named',
        body: "'The team decided' is how a decision becomes unowned, and unowned decisions are the ones that get quietly reversed by whoever feels strongest next quarter.\n\nName the person. Note who was consulted. Being consulted and being the decider are different roles and conflating them is how people end up feeling ignored when they were, in fact, heard.",
      },
    ],
    steps: [
      'State the decision in one sentence, in the past tense',
      'Date it and name the single decider',
      'List the options rejected, one reason each',
      'Write the condition that would reverse it',
      'Link it from the project brief so it is findable',
    ],
    template: {
      title: 'Decision record',
      body: 'DECISION — We are building the export pipeline in-house rather than buying.\n\nDATE — 12 March. DECIDER — Priya. CONSULTED — Marcus, Dana, security.\n\nWHY — Every vendor we evaluated requires data to leave our region, which two enterprise contracts forbid.\n\nREJECTED\n• Vendor A — no in-region processing.\n• Vendor B — in-region, but no audit log export, which legal requires.\n• Do nothing — three customers have this as a renewal blocker.\n\nWHAT WOULD REVERSE THIS — A vendor shipping in-region processing with audit export. Revisit at the January planning cycle regardless.',
    },
    pitfalls: [
      '"The team decided"',
      'Recording the choice but not the alternatives',
      'No reversal condition, so it never gets revisited',
      'Writing it somewhere nobody will search',
    ],
  },
  {
    id: 'launch-no-war-room',
    title: 'Run a launch without a war room',
    deck: 'A calm launch is one where every question was answered a week early.',
    category: 'Projects',
    minutes: 8,
    pro: true,
    icon: 'zap',
    hue: 'mint',
    gist: 'Pre-write the answers, name the rollback, and decide who calls it.',
    sections: [
      {
        heading: 'The war room is a symptom',
        body: "Eight people on a call for six hours is not diligence, it is unanswered questions arriving all at once. Every one of them could have been answered on a Tuesday the week before, calmly, by one person.\n\nThe work of a good launch happens in the days before it, and the launch itself should be boring. Boring is the target. If it is exciting, something in the preparation was skipped.",
      },
      {
        heading: 'Pre-write the four answers',
        body: "How do we know it is working. How do we know it is broken. How do we turn it off. Who decides. Write these down and circulate them before launch day.\n\nThe third one is the one people skip and the one that matters at 2am. 'Turn it off' should be a specific sequence of steps someone who was not involved could execute, and it should have been tested at least once.",
      },
      {
        heading: 'One incident commander',
        body: "During a launch, one named person makes the calls and everyone else supplies information. Not the most senior person — the person with the most context, who is not also doing hands-on work.\n\nThe commander's job is to decide, to keep a timeline, and to say out loud what is happening. Two people trying to command is worse than either one doing it alone.",
      },
      {
        heading: 'Ramp, do not flip',
        body: "One percent, then ten, then fifty, then everyone, with a real pause between each. Define in advance what you are watching and what number sends you back a step.\n\nA ramp turns a binary catastrophe into a small, recoverable observation. It also gives you real production data before the blast radius is large enough to matter.",
      },
      {
        heading: 'Write the timeline as it happens',
        body: "One person keeps a running log with timestamps: what changed, what was observed, what was decided. During the launch it keeps everyone synchronised; afterwards it is the entire input to the review.\n\nReconstructing a timeline from memory two days later produces a story rather than a record, and the story is always kinder to whoever tells it.",
      },
    ],
    steps: [
      'Write the four answers and circulate them a week early',
      'Test the rollback once, for real',
      'Name one incident commander who is not doing hands-on work',
      'Ramp 1 → 10 → 50 → 100 with defined pause criteria',
      'Keep a timestamped log from the first change',
    ],
    template: {
      title: 'Launch card',
      body: 'WORKING LOOKS LIKE — Checkout completion holds at or above 71%, error rate under 0.4%.\n\nBROKEN LOOKS LIKE — Completion under 65% for 10 minutes, OR any 5xx above 1%, OR two support tickets naming checkout.\n\nTURN IT OFF — Set flag checkout_v2 to 0 in the admin panel. Takes ~40 seconds, no deploy. Tested 8 March by Ana.\n\nCOMMANDER — Marcus. Backup: Priya.\n\nRAMP — 1% Tue 10am, 10% Tue 2pm, 50% Wed 10am, 100% Thu. 90 minutes of clean metrics between each step.',
    },
    pitfalls: [
      'A rollback nobody has ever run',
      'Two people trying to command',
      'Flipping to 100% because the ramp felt slow',
      'Reconstructing the timeline from memory afterwards',
    ],
  },
  {
    id: 'incident-review',
    title: 'The blameless incident review',
    deck: 'Blameless is not about being nice. It is about getting true information.',
    category: 'Projects',
    minutes: 8,
    pro: true,
    icon: 'alert-triangle',
    hue: 'mint',
    gist: 'Build the timeline first, ask what made the mistake easy, fix the system.',
    sections: [
      {
        heading: 'Why blame is expensive',
        body: "The moment people believe a review will assign fault, the quality of the information collapses. Details get softened, timelines get vague, and the one person who knows exactly what happened says the least.\n\nBlamelessness is not kindness. It is the price of accurate data, and accurate data is the only thing that lets you fix the cause instead of the symptom.",
      },
      {
        heading: 'Timeline before analysis',
        body: "Build the sequence of events with timestamps before anyone offers an opinion about causes. What was observed, what was believed at the time, what was done.\n\nThe 'believed at the time' column is the important one. Reviews go wrong when people reason from what everyone knows now, which was not available to anyone during the incident. The question is never why they did the wrong thing; it is why the wrong thing looked right at the time.",
      },
      {
        heading: 'Ask what made it easy',
        body: "Every human error sits inside a system that permitted it. A config that could be deployed without review. An alert that fires so often it is ignored. A runbook that was correct in 2023.\n\n'What made this easy to get wrong?' produces fixes. 'Who did it?' produces silence and a repeat next quarter.",
      },
      {
        heading: 'Separate detection from cause',
        body: "Two clocks matter: how long until it broke, and how long until anyone knew. They usually have completely different fixes, and the detection gap is frequently the more valuable one.\n\nAn outage you detect in ninety seconds is an inconvenience. The same outage detected by a customer email four hours later is a different event entirely, even though the cause is identical.",
      },
      {
        heading: 'Two actions, dated, or none',
        body: "A review that produces fourteen action items produces nothing. Two, with owners and dates, tracked in the same place as normal work.\n\nAdd one more discipline: at the next review, open by checking whether the last two happened. Without that check, incident actions are the first thing to be quietly dropped when the quarter gets busy.",
      },
    ],
    steps: [
      'Build the timeline with timestamps before discussing cause',
      'Record what people believed at the time, not what is known now',
      'Ask what made the mistake easy',
      'Measure time-to-break and time-to-detect separately',
      'Leave with two dated actions and check them next time',
    ],
    template: {
      title: 'Incident review',
      body: 'WHAT HAPPENED — Checkout returned 500s for 34 minutes. ~1,900 attempts affected.\n\nTIMELINE\n14:02 Config deployed changing the payment timeout from 30s to 3s.\n14:03 Error rate rises. No alert — the threshold is set at 5% and this peaked at 4.1%.\n14:31 Support forwards a customer email.\n14:36 Rolled back. Recovered at 14:36.\n\nWHAT MADE IT EASY — Timeout values live in a config file with no review requirement, and the units are not labelled. 3 was read as minutes.\n\nDETECTION GAP — 28 minutes. The alert threshold was above the actual impact level.\n\nACTIONS\n1. Label units in the config schema and require review on that file. Ana. 22 Mar.\n2. Add a checkout-specific error alert at 1%. Marcus. 19 Mar.',
    },
    pitfalls: [
      'Reasoning from what everyone knows now',
      'Treating "human error" as a root cause',
      'Ignoring the detection gap',
      'Fourteen action items',
    ],
  },
  {
    id: 'inbox-triage',
    title: 'The twelve-minute triage',
    deck: 'Reading everything is not a strategy. Sorting fast is.',
    category: 'Focus',
    minutes: 6,
    pro: true,
    icon: 'inbox',
    hue: 'amber',
    gist: 'One pass, four buckets, no work done during the pass.',
    sections: [
      {
        heading: 'Sorting and doing are different jobs',
        body: "The reason triage takes an hour is that people do the work as they find it. You open something, it takes four minutes, and by the time you look up the queue has grown again and you have no idea what is in it.\n\nSort first. Do nothing during the sort except decide. The whole pass should take twelve minutes regardless of volume, because deciding is fast and doing is not.",
      },
      {
        heading: 'Four buckets',
        body: "Reply now — under two minutes and genuinely urgent. Block — needs real thought, so it gets a slot on the calendar, not a place in your head. Delegate — has a better owner, and it goes to them with context in the same pass. Drop — no longer relevant, or relevant to someone who has not asked.\n\nEvery item goes in exactly one bucket. The discipline is that 'I will decide later' is not one of them.",
      },
      {
        heading: 'The drop bucket is the point',
        body: "Most people run a triage with three buckets and wonder why the queue never shrinks. Things that are genuinely fine to ignore need somewhere to go, and that somewhere has to be a deliberate action rather than a slow slide down the list.\n\nA good triage drops between a quarter and a half of what it touches. If yours never drops anything, you are not triaging, you are queueing.",
      },
      {
        heading: 'Twice a day, on a timer',
        body: "Two fixed windows, twelve minutes each, on a timer. Not continuous, because continuous triage is just interruption with a nicer name.\n\nTell people when your windows are. Almost nobody needs a reply inside four hours, and the ones who genuinely do will call you, which is the correct escalation path anyway.",
      },
    ],
    steps: [
      'Set a twelve-minute timer',
      'Sort into reply / block / delegate / drop — no work during the pass',
      'Delegate with context, in the same pass',
      'Drop generously',
      'Then work the reply bucket, on a second timer',
    ],
    template: {
      title: 'Triage window',
      body: 'REPLY NOW (under 2 min each)\n• Dana — confirm Thursday slot\n• Ana — yes to the schema change\n\nBLOCK (needs thought)\n• Pricing model feedback → Wed 9am block\n\nDELEGATE\n• Vendor security questionnaire → Marcus, with the Q3 answers linked\n\nDROP\n• Three FYI threads, one newsletter, one meeting invite with no agenda',
    },
    pitfalls: [
      'Doing the work during the sorting pass',
      'No drop bucket',
      'Continuous triage all day',
      'Delegating without context, which returns as a question',
    ],
  },
  {
    id: 'weekly-review',
    title: 'The weekly review',
    deck: 'Thirty minutes on Friday buys back most of Monday.',
    category: 'Focus',
    minutes: 7,
    pro: true,
    icon: 'calendar',
    hue: 'amber',
    gist: 'Close the loops, name next week’s one thing, and write Monday’s first move.',
    sections: [
      {
        heading: 'Close the open loops',
        body: "Walk the week's threads and finish the unfinished ones: the reply you drafted and never sent, the decision that has been waiting on you since Tuesday, the thing you said you would send.\n\nOpen loops are expensive out of proportion to their size, because each one occupies a small permanent slot in your attention. Twenty minutes of closing produces a disproportionate quiet.",
      },
      {
        heading: 'Name one thing for next week',
        body: "Not a list. One thing that, if it were the only thing that happened, would make next week a good week.\n\nThe constraint is the value. A list of seven priorities is a list of zero priorities, and you will discover which one was real on Thursday, having spent Monday to Wednesday on the others.",
      },
      {
        heading: 'Look at what actually happened',
        body: "Compare where the time went to where you intended it to go. Not to feel bad — to calibrate. If three of five days went to unplanned work, next week's plan should assume that, not pretend otherwise.\n\nMost chronic over-commitment is a measurement failure. People plan for the week they wish they had, and are surprised in the same way every Friday.",
      },
      {
        heading: 'Write Monday’s first move',
        body: "The last thing you do is write the specific first action for Monday morning. Specific enough to start without thinking: not 'work on pricing' but 'open the scenarios tab and rebuild the enterprise tier from the Q4 deals'.\n\nMonday morning is the least decisive part of the week. Do not spend it deciding.",
      },
    ],
    steps: [
      'Close every open loop you can in twenty minutes',
      'Note what got done and what did not',
      'Compare planned time to actual time and calibrate',
      'Choose the one thing for next week',
      'Write Monday’s first move as a specific action',
    ],
    template: {
      title: 'Weekly review',
      body: 'CLOSED — Sent the vendor answers, replied to Dana, filed the decision doc.\n\nSTILL OPEN — Pricing model. Second week running, which tells me something.\n\nPLANNED vs ACTUAL — Planned three deep blocks, got one. Two went to the incident. Next week: plan two, not three.\n\nTHE ONE THING — Pricing model v3 in front of Dana by Thursday.\n\nMONDAY 9AM — Open scenarios tab, rebuild enterprise tier from the four Q4 closed deals.',
    },
    pitfalls: [
      'Turning it into a planning session for seven priorities',
      'Skipping it on busy weeks',
      'Reviewing without comparing planned to actual',
      'Ending without a concrete first action',
    ],
  },
  {
    id: 'say-no',
    title: 'Say no without torching goodwill',
    deck: 'A clear no on Monday is a kindness. A vague yes is a betrayal on Friday.',
    category: 'Focus',
    minutes: 6,
    pro: true,
    icon: 'slash',
    hue: 'amber',
    gist: 'Say no to the timing, show the queue, and offer the smaller version.',
    sections: [
      {
        heading: 'The vague yes is the real damage',
        body: "'Sure, I'll try to get to it' feels generous and is not. The other person now plans around a thing that will not happen, and finds out late, when their options are worse.\n\nEvery no you avoid saying gets said eventually — by the calendar, at the worst possible moment, without you in the room to soften it.",
      },
      {
        heading: 'No to the timing, not the person',
        body: "Most requests are reasonable and simply arrive at a time when you cannot serve them. Say that. 'I can't take this before the 18th' is different from 'no', and it is usually the truth.\n\nIt also puts a real thing on the table to negotiate over. People can work with a date. They cannot work with a shrug.",
      },
      {
        heading: 'Show the queue',
        body: "Make the trade-off visible instead of asserting it. 'I have the pricing model and the migration in front of this. If this is more important than either, I will swap it in — which one comes out?'\n\nThis is not a rhetorical trap; sometimes they will pick one and be right. What it does is move the decision from your capacity, which they cannot see, to priority, which you can discuss.",
      },
      {
        heading: 'Offer the smaller version',
        body: "Almost every request has a version that costs a tenth as much and delivers most of the value. Half an hour of review instead of ownership. A pointer to the person who already solved it. A template instead of a bespoke document.\n\nThe smaller version is what makes a no land as helpfulness rather than refusal, and it is very often what they actually needed.",
      },
    ],
    steps: [
      'Answer within a day — a fast no is worth more than a slow one',
      'Say no to the timing, and give a real date',
      'Show what is in front of it and offer the swap',
      'Propose the smaller version',
      'Do not apologise more than once',
    ],
    template: {
      title: 'The no',
      body: "I can't take this on before the 18th — the pricing model and the migration are both in front of it and both have dates.\n\nIf this is more important than either, say so and I will swap it in; I would just want to be explicit about which one moves.\n\nSmaller version in the meantime: I can spend 45 minutes reviewing your draft on Thursday, which is probably where most of the value is anyway. Want me to book it?",
    },
    pitfalls: [
      'The vague yes',
      'Waiting three days to answer',
      'Explaining your workload as an excuse instead of a trade-off',
      'Apologising so much that the no reads as negotiable',
    ],
  },
  {
    id: 'first-thirty-days',
    title: 'Onboard someone in their first thirty days',
    deck: 'The first month decides how the next year goes. Design it.',
    category: 'Leading',
    minutes: 8,
    pro: true,
    icon: 'user-plus',
    hue: 'rose',
    gist: 'Ship something in week one, name the unwritten rules, and check in early.',
    sections: [
      {
        heading: 'Ship something in week one',
        body: "Find a real, small, genuinely useful thing they can complete and release in the first week. A copy fix, a small bug, a doc that is wrong.\n\nIt is not about the output. It is that they will have touched every part of the pipeline — the tools, the review process, the release path, the people — while the stakes are near zero. That map is worth more than three weeks of reading.",
      },
      {
        heading: 'Write down the unwritten rules',
        body: "Every team has norms nobody documented: which channel is for what, whether a thumbs-up counts as approval, how much notice a meeting needs, who to ask when something breaks at 6pm.\n\nNew people spend enormous energy inferring these, and they infer some of them wrong. Write the list. It takes an hour and it is the single highest-leverage onboarding document you will produce.",
      },
      {
        heading: 'Name the first thirty days out loud',
        body: "Tell them what good looks like at day 30, and say explicitly that shipping a lot is not it. Understanding the system, meeting the people, and asking a lot of questions is it.\n\nWithout this, competent people spend their first month anxious about output and asking fewer questions than they should, which is precisely backwards and costs months later.",
      },
      {
        heading: 'A buddy who is not the manager',
        body: "There is a class of question people will not ask their manager in month one — the ones that feel like admitting a gap. Those questions need somewhere to go.\n\nName a specific person, tell both of them it is a real part of the job, and put a recurring fifteen minutes in the calendar for the first month so it does not depend on anyone feeling brave.",
      },
      {
        heading: 'Ask at day 30 while they can still see it',
        body: "After a month they still have fresh eyes and can tell you exactly what was confusing. After three, they have normalised it and the information is gone forever.\n\nAsk two questions: what was confusing that should not have been, and what did you expect to find that was not there. Then fix one of the answers before the next person arrives.",
      },
    ],
    steps: [
      'Pick a real, small thing they can ship in week one',
      'Write down the unwritten rules before they start',
      'Say out loud what day 30 should look like',
      'Name a buddy who is not the manager, with a recurring slot',
      'Debrief at day 30 and fix one thing before the next hire',
    ],
    template: {
      title: '30-day plan',
      body: 'WEEK 1 — Environment running by Tuesday. Ship the settings page copy fix. Meet Ana, Marcus, Dana, and two people in support.\n\nWEEK 2 — Take one small ticket end to end. Read the three decision docs linked below. Sit in on a customer call.\n\nWEEKS 3-4 — Own a small feature with support. Start attending grooming.\n\nWHAT DAY 30 LOOKS LIKE — You can describe how a request flows through the system, you know who to ask about what, and you have asked a lot of questions. Volume of output is not the measure.\n\nBUDDY — Ana. 15 min, Tue and Thu.',
    },
    pitfalls: [
      'A first week of reading documentation',
      'Leaving the unwritten rules unwritten',
      'No buddy, or a buddy who was not told they are one',
      'Waiting until month three to ask what was confusing',
    ],
  },
  {
    id: 'kickoff',
    title: 'The kickoff that prevents three months of confusion',
    deck: 'Ninety minutes at the start is the cheapest time you will ever spend.',
    category: 'Leading',
    minutes: 7,
    pro: true,
    icon: 'compass',
    hue: 'rose',
    gist: 'Align on the problem, surface the assumptions, and name every decision right.',
    sections: [
      {
        heading: 'Start with the problem, not the plan',
        body: "Spend the first twenty minutes on the problem alone, with no solution talk allowed. It will feel slow and it is where the value is.\n\nIn most kickoffs that skip this, two people in the room are solving different problems and will not discover it until the build is half done. Twenty minutes now, or six weeks later.",
      },
      {
        heading: 'Surface assumptions in writing',
        body: "Ask everyone to write down, silently, the three things they are assuming that would sink the project if false. Then read them out.\n\nYou will get a list that includes at least one thing nobody else in the room assumed, and often one that is straightforwardly untrue and checkable this week. This exercise takes ten minutes and regularly saves a month.",
      },
      {
        heading: 'Name the decision rights',
        body: "For each of the three or four decisions that will matter — scope, date, technical approach, quality bar — say who decides and who is consulted. Out loud, in the room, written down after.\n\nAlmost every mid-project conflict is a decision-rights conflict wearing a costume. Settling them at the start, when nothing is contested, costs nothing. Settling them mid-project costs a week and some goodwill.",
      },
      {
        heading: 'Agree how you will communicate',
        body: "Where updates go, how often, who writes them, and what happens when something slips. Decide it now, when the project is calm.\n\nThe rule that matters most is the escalation one: what a person should do when they realise a date is at risk. Teams that agree this on day one find out about slips early. Teams that do not find out at the deadline.",
      },
      {
        heading: 'End with the first week written down',
        body: "Do not end on enthusiasm. End with named tasks for the first week and the date of the first checkpoint.\n\nA kickoff that ends with everyone feeling good and nobody knowing what happens Monday is where the first two weeks go.",
      },
    ],
    steps: [
      'Twenty minutes on the problem, with solutions banned',
      'Silent written assumptions, then read them out',
      'Name the decider and the consulted for each major decision',
      'Agree the update cadence and the escalation rule',
      'Leave with named first-week tasks and a checkpoint date',
    ],
    template: {
      title: 'Kickoff record',
      body: 'PROBLEM — Mobile signups do not connect a data source. 31% within 24h; support hears "did not know what to do next".\n\nASSUMPTIONS THAT WOULD SINK THIS\n• That people want to connect a source on mobile at all (Ana — testable this week from session data)\n• That the drop-off is comprehension, not permissions (Marcus — unverified)\n• That we can ship without touching billing (Priya — verified)\n\nDECISION RIGHTS — Scope: Priya. Date: Dana. Technical approach: Marcus. Quality bar: Priya + support lead.\n\nCOMMUNICATION — Written update in this space every Monday by 11am, written by Priya. If a date is at risk, say so the day you suspect it, not the day it slips.\n\nWEEK ONE — Ana pulls the session data. Marcus spikes the permissions path. Priya drafts the brief. Checkpoint: Friday 2pm.',
    },
    pitfalls: [
      'Jumping to solutions in the first ten minutes',
      'Leaving assumptions in people’s heads',
      'Unclear decision rights, discovered in week six',
      'Ending on enthusiasm with no named tasks',
    ],
  },
];
