---
title: The Newest Music-Reading AI Failed To Read My Single-Note Trombone Music
description:
  I gave my sheet music to the newest music-reading AI, and it failed. I gave it to a 20 year old
  Java app, and it crushed it.
date: 2026-10-23
tags: [music, trombone, orchestra, ai, computer-vision, omr, piano]
draft: false
---

Recently, I've been accompanying choir rehearsals to a community choir/orchestra performance of Rob
Gardner's _Lamb of God_. I also committed to playing trombone in the orchestra when the performance
comes around.

I've played trombone in orchestras for years, and while I love performing music such as _Lamb of
God_ with choirs, trombones often have very boring music, composed mostly of rests and sustained
mid-range notes, with an occasional "main character" moment where I get to play higher and louder.

Leading up to my first rehearsal on trombone, combined with the choir, I felt slightly disappointed
knowing that I wouldn't be able to play the piano and be present for every note. I was also a bit
worried about knowing where I was in the music with all the rests, and notes that provide
little-to-no context about the rest of the ensemble. _Lamb of God_ is especially difficult to follow
by counting rests because several movements have time changes nearly every bar, meaning that sitting
and counting my fingers (my typical band/orchestra strategy haha) would not work.

In previous ensembles, when performing literature in the public domain I would often go find the
entire orchestral score, save it to my iPad, highlight the parts where the trombone plays, and then
use that in rehearsals and performances. It's fun, because I can see what's going on in the ensemble
around me, though scores are typically printed on very large paper, so it's practically unreadable
on my iPad, not to mention the fact that I then need to turn pages every 4 measures or so. Not super
practical for difficult or involved music.

This doesn't work on newer pieces of music where I don't have access to the entire score. If only I
had a way to combine my trombone part with the choir and piano reduction...

I'd recently been digging into research on Optical Music Recognition (OMR) which is basically the
problem of taking sheet music and converting it into a digital format, like ABC notation, MusicXML,
or something else. This allows you to edit the music source. I've been reading scientific articles,
exploring neural network architectures, and comparing against conventional algorithmic approaches to
OMR to try to better understand how people are applying deep learning to real problems in music.

I decided that these models might be able to help me scan both my trombone part and the choir/piano
parts (which I've been rehearsing off of for weeks) and then allow me to splice to two together in
MuseScore, giving me exactly that combined score of my trombone music on top of the familiar choral
score and piano reduction.

# The Experiment

I've been researching OMR with the aim of ultimately helping produce multimodal music models that
can communicate natively with musicians across all modalities that musicians currently communicate
in today, including speech, text, sheet music (digital and visual), auditory music (actually playing
an instrument) and have deep understanding of music theory and structure.

OMR is one facet of that, and this experiment was intended to be a way to get my feet wet with a
real experiment that I will actually use. I wanted to see if I could use these models not to just
get me 90% of the way there while requiring me to fall back to the normal trombone part during
rehearsal, I wanted something that would hold up in a real rehearsal without a fallback.

After all, with all AI, that's what really matters. Benchmarks are good indicators of performance,
but they all fall short of the ultimate metric which is whether it holds up for a real user with a
real problem.

In my case, this has two main requirements:

1. **The trombone part must be perfect.** I can't afford to have incorrect notes, rhythms, or
   entrances in my score. Even one wrong note at the wrong time could be a huge pie in my face if I
   don't catch it on my own.
2. **The parts must be synchronized perfectly.** The difference here is that I can't have a vocal
   solo part arriving a measure early in my version, because that throws me off. The other parts
   must all have the correct timing so that I have the same source of truth for location and timing
   as the other musicians.

Things like dynamics and articulation are still crucial, but having listened to the score so many
times, I will probably be fine without them. But it's still very nice to have because I can't keep
everything in my brain; that's why we have written sheet music.

Minor errors, such as a wrong note in the piano part, or a mangled triplet in a vocal solo, aren't
of a huge concern to me in this situation. Of course it's ideal not to have those, but I can survive
a rehearsal and a performance with mistakes like this.

## Data

I came to this with two primary pieces of data to feed the models: my trombone part, and the
choral/piano score. (In case this isn't clear, the piano score is a reduction of the orchestra
parts.) The trombone part was 36 pages across 14 movements, and the vocal score was 140 pages,
including SATB, piano, and soloist staves.

Importantly, both PDFs were born-digital (meaning they were exported as digital files and stayed
that way until the time I received them, they were never printed and scanned). The choral score had
been marked up with handwritten highlights and notes by the conductor. The files were both Finale
exports, which is one of the top digital music editors. Born-digital as Finale exports is important
because it means that the PDFs had bar numbers, staff labels, and Music-font glyphs embedded into it
with precise positions recorded.

The layout of the music also varied throughout the score. The score hides empty staves, so soloists
only show up when they sing. Also, sometimes the choir splits until 4 staves (S/A/T/B) instead of 2
(SA/TB).

## Models

Machine learning models in OMR are broken up into two categories:

1. **Neural Models.** These are newer, neural-network powered deep-learning models that train
   millions to billions of parameters on massive amounts of data, like modern LLMs do.
2. **Algorithmic Tools.** These are older, algorithm-based tools that use little to no neural
   networks, and instead rely on statistical properties and rule-based flows written in code to try
   to systematically parse and read the music.

### Neural Models

#### Transcoda

The neural model that I attempted to use was **Transcoda**, a brand new lightweight model released
earlier this year that dominates on OMR benchmarks. They pulled it off by exploiting a
non-uniqueness issue in music training data, basically noticing that having dozens of valid ways of
digitally representing the same piece of sheet music leads to issues in training where correct
responses are penalized incorrectly, causing models to fail to learn to parse the sheet music
correctly. Instead, they enforced a normalized form for the sheet music, allowing their model to
learn much more efficiently. (There was much more to it, but I won't discuss it here. See their
paper if you'd like to learn more.)

At 59M parameters, Transcoda was small enough for me to run on my MacBook, so I did. I gave it a try
on the entire first page of Movement 1 of the trombone score, with its 12 notes and many measures of
rest.

Let me pause to excite you a bit--this was a big moment! I was taking research that I'd done,
bringing it to my machine, to my life, to solve a problem I was experiencing, while exploring a
direction I hope to take my career in. How amazing that I can run a frontier model on my computer
like this!

Back to the music. Want to take a guess what happened?

The model ran for nearly 4 minutes (219 seconds), eventually hit its 2,047-token limit, and failed.
The output it gave me was completely unusable. Not even the "90% of the way there but requires some
tweaking" but just complete garbage.

It invented a second staff that didn't exist, along with a 13/8 time signature that was definitely
not part of the original score, and then just repeated a rest token in a loop for the whole time,
not even yielding a single note.

Here was the original output from the model, both in `**kern` format (the digital format Transcoda
writes images to) and what the sheet music rendering of that looks like:

<-- insert `**kern` code and image -->

I tried again using an optional feature of the Transcoda model, grammar-constrained decoding.
Basically, this forced the model to only output music that is valid.

Here, it took about 23 minutes, hit the token limit again, and failed. It got the clef and first
time signature right (which is a pretty low bar) and then broke down again with empty lines and
random tremolo and octave down tokens, which were meaningless without any actual notes. The output
was garbage again, but at least this time it was syntactically valid garbage 🤷‍♂️

I tried running this model on the choral/piano score too, just on the first page. It was quicker
here, taking about 48 seconds to run, but gave garbage once again. It declared 2 parts (staves) and
then wrote data with 3 columns. It completely missed the SA and TB staves, and it generated about 20
bars where the original music only had 7.

These findings were disappointing to say the least. I'd been really hoping that I could get a model
that could do what I needed it to. The benchmark values and examples in their paper gave me hope
that it was up to the task.

So why did the "best model" fail so hard?

The answer comes down to training data. Transcoda was trained primarily on piano grand-staff music
only (piano music with two staves for treble and bass clef), all synthetically generated for them.
Even though trombone music, with a single staff and single note, are technically easier to analyze
than piano music, the model hadn't seen anything like it so it completely failed.

#### Legato

Next, I hoped to try another model, Legato 2, which is also a recent (2026) model and successor to
Legato 1. These models were much larger and less likely to run on my laptop. Unfortunately, I had
other issues with these models. The weights are open on HuggingFace, but gated behind per-user
approval by the model authors, so I requested access to Legato 2 but have not yet received access.
Legato 1 automatically granted access, but it relies on other weights that I did not have access to.

Because of this, I was not able to test either of the Legato models, though when I get access I will
be back for more testing with them!

### Algorithmic Tools

Because I was unable to use the neural models I hoped to use, and Transcoda's performance was
disappointing, I resorted to open-source algorithmic tools for this problem. For that, I turned to
**Audiveris**, and older open source Java tool.

Audiveris is a staff-first pipeline, and works by finding staves, barlines, and symbols, and then
assembling them into a usable format. While mostly mechanical and algorithmic, Audiveris uses a
trained glyph classifier, so it has some elements of machine learning but functions primarily as a
rule-based classifier and not as an end-to-end model like Transcoda and Legato aim to be.

Algorithmic tools like this have their place and can function well, but typically they are far
inferior to newer neural networks that can crush any task you put a loss function too. They often
win in speed (don't require trillions of computations to feed through a neural network) but
typically fail on complex tasks, because each individual component of an algorithm like this is
fragile, so a mistake early in the pipeline feeds throughout and spoils most of the results, whereas
neural networks attempt to perform the task comprehensively, being less prone to this type of
cascading error.

(Those working with agents will call me out by saying that agent errors cascade too. Yes, you're
correct; the difference here is that these neural models run a task through the model once and give
an output, agents break tasks into multiple steps and perform each step in sequence, reintroducing
the risk of compounding error that's absent in a single pass.)

When I passed my music into Audiveris, it analyzed a page of music in about 10 seconds, rather than
the several minutes that Transcoda required.

On the same first page of the trombone part, it got the bar count right, and got all the notes (all
12 of them haha) exactly right.

On the choir and piano part, it correctly split the staves into SA/TB/Piano right hand/Piano left
hand, and got most of the notes right.

It still got some things wrong, but they were diagnosable. For example, the original score has
oversized time signature common in pit orchestra music, which Audiveris failed on, reading them
instead as notes. A 12/8 time signature at the end of a line (serving to notify musicians that the
next line begins with a time change) mistakenly created an extra bar in that line. Clef changes
mid-staff were interpreted as notes.

The output still wasn't perfect. I'd say it still wasn't even at the 90% bar. This meant that as is,
the music was unusable for me. However, there's a silver lining.

## The Answer Key

Remember how I said earlier that the born-digital PDFs contain symbols? Well, it holds both a text
and a vector layer, meaning that we actually had a way to verify the output of the model against the
ground truth programatically. For example, bars were numbered. Multi-measure rests had measure
number ranges. Time signatures, clefs, and staff names showed up. Lyric syllables were given with
their positions. Noteheads were given with exact staff positions. Staff lines and barlines were
given with the exact vector geometry that they were defined with.

By no means was reconciling this an easy task. But having the ground truth in this case meant the
task was solvable. Fortunately we have AI tools that can deal with programming tasks like this for
us.

Instead of treating Audiveris as a standalone OMR tool that provided sufficient music, we used it to
read the music and then compared against the PDF to check the structure. Here are some of the
example of issues identified that Claude crunched and fixed:

- Time signatures erased before reading were re-applied from the PDF
- Multi-bar rests were written out from the printed bar labels
- Staff identity per system was taken from the printed labels
- Clef symbols misread as notes were removed, and notes were re-read into the printed clef.
- Notes printed in the same vertical column were re-timed to start together
- Lyric syllables were places from the text layer, since Audiveris got none

Beyond this, we were also able to perform a pitch check from the notehead positions to determine if
the transcribed notes match the notes in the printed music.

<-- Should answer why we didn't just write a script to parse the PDF. Why did we still use
Audiveris? Did we have to? Was there another option? I honestly don't know -->

Audiveris did a good job providing a foundational music reading tool, and the PDF provided ground
truth to verify, but it wasn't all automatic, nor was the manual parsing something that Claude could
do alone. It was able to get pretty far, but I still had to catch many of the really crucial and
hard to spot errors.

For example, I could see that an eighth note pickup in the choir was vertically aligned with notes
occuring 3 beats earlier in the piano score. It was syntactically correct, but confusing to any
reader. Or another time when wrong notes occurred because the right hand was switching between
clefs, and Audiveris and Claude couldn't see it. In one of the movements, a vocalist part was
written a measure ahead of where it should actually be, which I only caught from listening to the
recordings and following along, and then confirming in the score. In another spot, the trombone
showed an A natural where the original score had an A flat. Mistakes like these are very small and
incredibly difficult to catch, which is why my requirements are so strict. Even though the
rule-based algorithm didn't get there on its own, it was something that I could build on top of by
pointing out mistakes and building additional rules for my specific use case. It's likely not
something someone else could put their music into and get out exactly what they need, but it's
closer. The long-term solution is helping frontier models to train on more and more types of data so
that they can handle complex tasks like this.

## The Result

All of this work was done on Thursday, October 22, prior to my 7pm rehearsal, the real test of the
success of this! I knew before the rehearsal that the piano and choir parts still had mistakes. They
were far from perfect, close to the "90% there but need some tuning" that would make my job as a
pianist really difficult. But I hoped the trombone part was perfect. This was the time to test!

The rehearsal began, and all went smoothly. The choir and piano parts followed the people singing
and the rest of the orchestra members well, and I could stay with the music. When we got to parts
the trombone played at, the whole trombone staff was colored blue so I could see it clearly and know
I needed to play.

Though I was initially nervous about playing the wrong thing, I soon came to trust the music and
found that it worked quite well for me. There were a couple of places that the notes written did not
sound very good with the rest of the orchestra, and I was concerned the notes were wrong, so I
checked the original part. Same notes. After rehearsal, I checked with the conductor to make sure my
part wasn't different from the score. Sure enough, it was the same. So perhaps there were wrong
notes, but if so they were there from the beginning and simply got carried through to my part. This
sure bolstered my confidence that the extraction worked, though it showed that I am far from a
system that intelligently understands the music, because it likely would have flagged that the
trombone part had a note that didn't fit into the chord the rest of the ensemble was playing.

Because I had access to the whole chordal texture in the piano reduction, I was even able to pitch
in a couple times to fill missing parts on the trombone or with my voice for instrumentals or vocal
soloists who weren't at that rehearsal. For example, I joined our one French Horn on the triumphal
French Horn duet in "Hosanna", filled a missing bassoon part, and sang some of John's solo parts
while he was gone. If all I had was the trombone part, the rehearsal would have had silence in this
sections, making it harder for the other musicians to see how their part supports or fits into the
greater tapestry of the music.

# Takeaways

The first thing that shocked me in this experiment was how impactful the variations in staves was to
the Transcoda model. To a musician, reading one staff versus two or four or even 20 is
inconsequential. Sure, maybe reading all at once is hard, but they can read and parse each
individual staff quite easily. I had no idea it would be such a leap for a model like Transcoda to
try to parse a single staff instead of a grand staff.

Presumably, the Transcoda model has been built in a way that would allow it to easily read different
formats like this, but the training data has just not exposed it to music other than piano music
with a grand staff.

In order to improve a model like Transcoda, it is necessary to include data with some of the
following characteristics for it to learn on:

- Variable staff counts, including hidden empty staves
- Single-line instrument parts with multi-measure rests
- Cautionary key/time signature changes at the end of lines/pages
- Mid-staff clef changes
- Tuplet numerals printed only on the first group, or not at all
- Lyrics
- Hand markings and other performance markings.

In the case where so much of modern music is born-digital and engraved with labels like what we were
able to exploit, OMR is quite practical and feasible. However, much of the need for OMR falls in the
realm of analyzing and parsing historical and handwritten music with no digital counterparts and
scanned, often with blemishes on the page that obscure the music.

I'm looking forward to continuing to work towards building intelligent music systems that can reason
with us about music and assist in musical tasks, enabling musicians to more effectively experiment
and produce music in multiple formats.
