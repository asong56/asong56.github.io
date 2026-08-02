---
REV: 20260802T1848Z
TAG: software, engineering
---

# THE 56 LAWS OF SOFTWARE ENGINEERING

*I found that the abbreviation of the title is **lose**...*

> **Essential principles, laws and mental models that shape how we build software**
> 
> *Created by Dr. Milan Milanović* ([lawsofsoftwareengineering.com](https://lawsofsoftwareengineering.com))

---

### 1. Conway's Law

Organizations design systems that mirror their own communication structure.

### 2. Premature Optimization (Knuth's Optimization Principle)

Premature optimization is the root of all evil.

### 3. Hyrum's Law

With a sufficient number of API users, all observable behaviors of your system will be depended on by somebody.

### 4. The Boy Scout Rule

Leave the code better than you found it.

### 5. YAGNI (You Aren't Gonna Need It)

Don't add functionality until it is necessary.

### 6. Brooks's Law

Adding manpower to a late software project makes it later.

### 7. Gall's Law

A complex system that works is invariably found to have evolved from a simple system that worked.

### 8. The Law of Leaky Abstractions

All non-trivial abstractions, to some degree, are leaky.

---

### 9. Tesler's Law (Conservation of Complexity)

Every application has an inherent amount of irreducible complexity that can only be shifted, not eliminated.

### 10. CAP Theorem

A distributed system can guarantee only two of consistency, availability, and partition tolerance.

### 11. Second-System Effect

Small, successful systems tend to be followed by overengineered, bloated replacements.

### 12. Fallacies of Distributed Computing

A set of eight false assumptions that new distributed system designers often make.

### 13. Law of Unintended Consequences

Whenever you change a complex system, expect surprises.

### 14. Zawinski's Law

Every program attempts to expand until it can read mail.

### 15. Dunbar's Number

There is a cognitive limit of about 150 stable relationships one person can maintain.

### 16. The Ringelmann Effect

Individual productivity decreases as group size increases.

---

### 17. Price's Law

The square root of the total number of participants does 50% of the work.

### 18. Putt's Law

Those who understand technology don't manage it, and those who manage it don't understand it.

### 19. Peter Principle

In a hierarchy, every employee tends to rise to their level of incompetence.

### 20. Bus Factor

The minimum number of team members whose loss would put the project in serious trouble.

### 21. Dilbert Principle

Companies tend to promote incompetent employees to management to limit the damage they can do.

### 22. Parkinson's Law

Work expands to fill the time available for its completion.

### 23. The Ninety-Ninety Rule

The first 90% of the code accounts for the first 90% of development time; the remaining 10% accounts for the other 90%.

### 24. Hofstadter's Law

It always takes longer than you expect, even when you take into account Hofstadter's Law.

---

### 25. Goodhart's Law

When a measure becomes a target, it ceases to be a good measure.

### 26. Gilb's Law

Anything you need to quantify can be measured in some way better than not measuring it.

### 27. Murphy's Law / Sod's Law

Anything that can go wrong will go wrong.

### 28. Postel's Law

Be conservative in what you do, be liberal in what you accept from others.

### 29. Broken Windows Theory

Don't leave broken windows (bad designs, wrong decisions, or poor code) unrepaired.

### 30. Technical Debt

Technical Debt is everything that slows us down when developing software.

### 31. Linus's Law

Given enough eyeballs, all bugs are shallow.

### 32. Kernighan's Law

Debugging is twice as hard as writing the code in the first place.

---

### 33. Testing Pyramid

A project should have many fast unit tests, fewer integration tests, and only a small number of UI tests.

### 34. Pesticide Paradox

Repeatedly running the same tests becomes less effective over time.

### 35. Lehman's Laws of Software Evolution

Software that reflects the real world must evolve, and that evolution has predictable limits.

### 36. Sturgeon's Law

90% of everything is crap.

### 37. Amdahl's Law

The speedup from parallelization is limited by the fraction of work that cannot be parallelized.

### 38. Gustafson's Law

It is possible to achieve significant speedup in parallel processing by increasing the problem size.

### 39. Metcalfe's Law

The value of a network is proportional to the square of the number of users.

### 40. DRY (Don't Repeat Yourself)

Every piece of knowledge must have a single, unambiguous, authoritative representation.

---

### 41. KISS (Keep It Simple, Stupid)

Designs and systems should be as simple as possible.

### 42. SOLID Principles

Five main guidelines that enhance software design, making code more maintainable and scalable.

### 43. Law of Demeter

An object should only interact with its immediate friends, not strangers.

### 44. Principle of Least Astonishment

Software and interfaces should behave in a way that least surprises users and other developers.

### 45. Dunning-Kruger Effect

The less you know about something, the more confident you tend to be.

### 46. Hanlon's Razor

Never attribute to malice that which is adequately explained by stupidity or carelessness.

### 47. Occam's Razor

The simplest explanation is often the most accurate one.

### 48. Sunk Cost Fallacy

Sticking with a choice because you've invested time or energy in it, even when walking away helps you.

---

### 49. The Map Is Not the Territory

Our representations of reality are not the same as reality itself.

### 50. Confirmation Bias

A tendency to favor information that supports our existing beliefs or ideas.

### 51. The Hype Cycle & Amara's Law

We tend to overestimate the effect of a technology in the short run and underestimate the impact in the long run.

### 52. The Lindy Effect

The longer something has been in use, the more likely it is to continue being used.

### 53. First Principles Thinking

Breaking a complex problem into its most basic blocks and then building up from there.

### 54. Inversion

Solving a problem by considering the opposite outcome and working backward from it.

### 55. Pareto Principle (80/20 Rule)

80% of the problems result from 20% of the causes.

### 56. Cunningham's Law

The best way to get the correct answer on the Internet is not to ask a question, it's to post the wrong answer.