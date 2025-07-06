"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, ArrowRight, CheckCircle, Zap, Target, Star, TrendingUp } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <h1 className="text-xl font-semibold">EmailCraft</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button onClick={onGetStarted} className="text-sm">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              ✨ The secret behind 10+YC startup job offers
            </Badge>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Write emails that
              <span className="block bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                actually get replies
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Master the email writing approach that helped Soham Parekh land positions at 10+ YC startups with a 90%+ response rate.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button onClick={onGetStarted} size="lg" className="text-base px-8 py-6">
                Start Writing Better Emails
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center"
                    >
                      <span className="text-xs font-medium">{i}</span>
                    </div>
                  ))}
                </div>
                <span>Join 2,000+ professionals</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-row justify-center items-center gap-6 flex-wrap max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-lg sm:text-3xl font-bold text-primary mb-1">90%+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Response Rate</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-3xl font-bold text-primary mb-1">10+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">YC Startup Offers</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-3xl font-bold text-primary mb-1">2000+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Story */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">The <span className="text-primary">Soham Parekh</span> Method</h2>
            <p className="text-lg text-muted-foreground">How one person cracked the code to email success</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">The Problem</h3>
                  <p className="text-sm text-muted-foreground">
                    Generic emails get ignored. Soham was tired of sending templated messages that disappeared into the
                    void.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">The Discovery</h3>
                  <p className="text-sm text-muted-foreground">
                    He developed a systematic approach: personal storytelling, specific value props, and strategic
                    follow-ups.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">The Results</h3>
                  <p className="text-sm text-muted-foreground">
                    10 job offers from Y Combinator startups. 90%+ response rate. A proven system that works.
                  </p>
                </div>
              </div>
            </div>

            <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                </div>
                <blockquote className="text-lg font-medium">
                  &ldquo;I went from getting ignored to having hiring managers fight over me. The difference was night and
                  day.&rdquo;
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">SP</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Soham Parekh</div>
                    <div className="text-xs text-muted-foreground">Software Engineer at YC Startup</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why these Emails work?</h2>
            <p className="text-lg text-muted-foreground">The key ingredients that make all the difference</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-border/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 mx-auto mb-4">
                <Target className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Hyper-Personalized</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every email is crafted with your unique background, making each message feel genuinely personal and
                relevant.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-border/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 mx-auto mb-4">
                <Zap className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Multiple Variations</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get 5 different approaches for every situation - from formal proposals to friendly follow-ups.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-border/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Proven Framework</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Based on real results - the exact approach that secured positions at top-tier startups.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Before/After */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">See the difference</h2>
            <p className="text-lg text-muted-foreground">Generic vs. strategic email writing</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">Generic Email</span>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-sm">
                <div className="font-medium mb-2">Subject: Job Application</div>
                <div className="text-muted-foreground">
                  Dear Hiring Manager,
                  <br />
                  <br />I am writing to apply for the software engineer position. I have experience in React and
                  Node.js. Please find my resume attached.
                  <br />
                  <br />
                  Best regards,
                  <br />
                  John Doe
                </div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">Response rate: ~5%</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Soham&apos;s Method</span>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-sm">
                <div className="font-medium mb-2">Subject: RE:Engineering at Happenstance.</div>
                                  <div className="text-muted-foreground">
                    tldr,
                    <br />
                    <br />I love everything about what Happenstance is doing. I don&apos;t have many hobbies outside coding. I
                    am not athletic, bad at singing, don&apos;t drink, can&apos;t dance. Building is the only thing I am good at. At
                    this point, I want to be a part of taking something from O&gt;1 or 1&gt;100. I just want to be heads
                    down chasing that goal
                    <br />
                    <br />
                    hi,
                    <br />
                    <br />
                    Really loved what you were building at Happenstance and wanted to reach out to see if there were any openings for Engineers in the early team...
                  </div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">Response rate: ~90%</div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your emails?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of professionals who&apos;ve upgraded their email game
          </p>

          <Card className="p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <div className="space-y-6">
              <div className="flex justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>5 email variations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Personalised Emails</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Proven framework</span>
                </div>
              </div>
              <br />
              <Button onClick={onGetStarted} size="lg" className="text-base px-8 py-6">
                Start Writing Better Emails
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <p className="text-xs text-muted-foreground">
                No credit card required • Start writing better emails in 2 minutes
              </p>
            </div>
          </Card>
        </div>
      </section>
      <footer className="w-full py-6 border-t border-border text-center text-xs text-muted-foreground bg-background">
        A product of <span className="font-semibold text-primary">@lessboringlabs.</span>
      </footer>
    </div>
  )
}
