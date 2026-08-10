from manim import *
import numpy as np
from scipy.integrate import solve_ivp

# Native portrait design; final render target controlled by CLI.
config.frame_width = 9
config.frame_height = 16
config.background_color = "#050816"

BG = "#050816"
INK = "#EEF5FF"
MUTED = "#8FA4C5"
CYAN = "#18D9D0"
MAGENTA = "#FB4891"
GOLD = "#FFCF5A"
BLUE = "#5787FF"


def clamp01(x):
    return max(0.0, min(1.0, float(x)))


def hex_interp(c0, c1, a):
    a = clamp01(a)
    x0 = np.array([int(c0[i:i+2], 16) for i in (1, 3, 5)], dtype=float)
    x1 = np.array([int(c1[i:i+2], 16) for i in (1, 3, 5)], dtype=float)
    x = np.round(x0 * (1-a) + x1 * a).astype(int)
    return "#%02X%02X%02X" % tuple(x)


class C218Scene(Scene):
    def construct(self):
        self.camera.background_color = BG
        self.add(self._background())
        self.beat1_hook()
        self.beat2_oscillator()
        self.beat3_catalyst()
        self.beat4_front()
        self.beat5_spiral()
        self.beat6_excitation()
        self.beat7_domino()
        self.beat8_payoff()

    def _background(self):
        rings = VGroup()
        for r, op in [(7.4, .07), (5.9, .05), (4.7, .035)]:
            rings.add(Circle(radius=r, stroke_color=BLUE, stroke_width=1.4, stroke_opacity=op))
        specks = VGroup()
        rng = np.random.default_rng(218)
        for _ in range(46):
            x = rng.uniform(-4.1, 4.1)
            y = rng.uniform(-7.7, 7.7)
            rr = rng.uniform(.008, .025)
            specks.add(Dot([x,y,0], radius=rr, color=hex_interp(BLUE, CYAN, rng.random()), fill_opacity=rng.uniform(.12,.35)))
        return VGroup(rings, specks)

    def label(self, text, color=INK, y=6.55, scale=.46):
        t = Text(text, font="DejaVu Sans", weight=BOLD, color=color).scale(scale)
        t.move_to([0,y,0])
        return t

    def small(self, text, y=-6.65, color=MUTED, scale=.31):
        t = Text(text, font="DejaVu Sans", color=color).scale(scale)
        t.move_to([0,y,0])
        return t

    def dish(self, radius=3.6, y=-.15):
        glow = Circle(radius=radius*1.03, stroke_color=CYAN, stroke_width=7, stroke_opacity=.16).move_to([0,y,0])
        rim = Circle(radius=radius, stroke_color="#BFEFFF", stroke_width=4, fill_color="#0A1630", fill_opacity=.92).move_to([0,y,0])
        inner = Circle(radius=radius*.965, stroke_color=BLUE, stroke_width=1.8, stroke_opacity=.34).move_to([0,y,0])
        return VGroup(glow, rim, inner)

    def beat1_hook(self):
        dish = self.dish(3.65, -.25)
        title = self.label("CHEMISTRY MAKES WAVES", GOLD)
        phase = ValueTracker(0)
        spirals = VGroup()
        centers = [(-1.15,.75), (1.05,.25), (-.1,-1.15)]
        cols = [CYAN, MAGENTA, GOLD]
        for (cx,cy), col, off in zip(centers, cols, [0,2.1,4.4]):
            s = always_redraw(lambda cx=cx,cy=cy,col=col,off=off: ParametricFunction(
                lambda u: np.array([
                    cx + (0.12 + 0.145*u)*np.cos(u + phase.get_value() + off),
                    cy-.25 + (0.12 + 0.145*u)*np.sin(u + phase.get_value() + off), 0]),
                t_range=[0, 6.6*PI, .055], color=col, stroke_width=5.2).set_stroke(opacity=.88))
            spirals.add(s)
        self.play(FadeIn(dish, run_time=.6), FadeIn(title, shift=UP*.1, run_time=.55))
        self.add(spirals)
        self.play(phase.animate.set_value(1.8), run_time=3.52, rate_func=linear)
        self.play(FadeOut(VGroup(title, spirals, dish), run_time=.5))

    def beat2_oscillator(self):
        title = self.label("NOT A ONE-WAY FADE", CYAN)
        def ode(t,z):
            x,y=z
            return [x - x**3/3 - y + .55, .08*(x + .7 - .8*y)]
        ts=np.linspace(0,60,2401)
        sol=solve_ivp(ode,(0,60),[-1,1],t_eval=ts,rtol=1e-7,atol=1e-9)
        xs=sol.y[0]
        prog=ValueTracker(0)
        nodes=VGroup(*[Circle(.53, stroke_width=3.2, color=c, fill_color=c, fill_opacity=.15) for c in (CYAN,MAGENTA,GOLD)])
        nodes.arrange(RIGHT,buff=.62).move_to([0,.55,0])
        labels=VGroup(*[Text(x,font="DejaVu Sans",weight=BOLD,color=INK).scale(.32).move_to(n) for x,n in zip(("A","B","C"),nodes)])
        arrows=VGroup(Arrow(nodes[0].get_right(),nodes[1].get_left(),buff=.1,color=MUTED,stroke_width=3),
                      Arrow(nodes[1].get_right(),nodes[2].get_left(),buff=.1,color=MUTED,stroke_width=3),
                      CurvedArrow(nodes[2].get_bottom()+DOWN*.1,nodes[0].get_bottom()+DOWN*.1,angle=-PI/2,color=BLUE,stroke_width=3))
        graph=Axes(x_range=[0,10,2],y_range=[-2.2,2.2,1],x_length=6.7,y_length=3.1,tips=False,axis_config={"stroke_opacity":.35,"stroke_width":2}).move_to([0,-2.7,0])
        curve=always_redraw(lambda: graph.plot(lambda x: 1.4*np.sin(.92*x + 6.2*prog.get_value()) + .18*np.sin(2.6*x), x_range=[0,10,.04], color=CYAN, stroke_width=4))
        cursor=always_redraw(lambda: Dot(graph.c2p(5,1.4*np.sin(.92*5+6.2*prog.get_value())+.18*np.sin(13)),radius=.08,color=GOLD))
        pulse=always_redraw(lambda: Circle(.45+.11*(1+np.sin(6.2*prog.get_value())),stroke_color=MAGENTA,stroke_opacity=.4,stroke_width=5).move_to(nodes[int((prog.get_value()*9)%3)].get_center()))
        sub=self.small("feedback repeatedly changes the chemical state")
        group=VGroup(title,nodes,labels,arrows,graph,sub)
        self.play(FadeIn(group, run_time=.7))
        self.add(curve,cursor,pulse)
        self.play(prog.animate.set_value(1),run_time=7.25,rate_func=linear)
        self.play(FadeOut(VGroup(group,curve,cursor,pulse),run_time=.45))

    def beat3_catalyst(self):
        title=self.label("COLOR REVEALS THE CYCLE", MAGENTA)
        dish=self.dish(3.35,-.15)
        state=ValueTracker(0)
        fill=always_redraw(lambda: Circle(3.08,fill_color=hex_interp(CYAN,MAGENTA,.5+.5*np.sin(state.get_value())),fill_opacity=.74,stroke_width=0).move_to([0,-.15,0]))
        center=always_redraw(lambda: Circle(.75+.08*np.sin(state.get_value()*1.7),stroke_color=GOLD,stroke_width=4,fill_opacity=0).move_to([0,-.15,0]))
        sub=self.small("a metal catalyst makes hidden chemistry visible")
        self.add(fill); self.play(FadeIn(VGroup(dish,title,sub),run_time=.55),FadeIn(center,run_time=.4))
        self.play(state.animate.set_value(4*PI),run_time=7.25,rate_func=linear)
        self.play(FadeOut(VGroup(fill,center,dish,title,sub),run_time=.45))

    def beat4_front(self):
        title=self.label("A REACTION FRONT", GOLD)
        dish=self.dish(3.55,-.15)
        grid=VGroup()
        for yy in np.linspace(-2.6,2.2,9):
            for xx in np.linspace(-2.7,2.7,10):
                if xx*xx+(yy+.15)**2 < 8.7:
                    grid.add(Dot([xx,yy-.15,0],radius=.035,color=BLUE,fill_opacity=.25))
        r=ValueTracker(.12)
        ring=always_redraw(lambda: Circle(radius=r.get_value(),stroke_color=GOLD,stroke_width=8,stroke_opacity=.92).move_to([-1.1,-.65,0]))
        wake=always_redraw(lambda: Circle(radius=max(.04,r.get_value()-.22),stroke_color=MAGENTA,stroke_width=4,stroke_opacity=.55).move_to([-1.1,-.65,0]))
        cue=Dot([-1.1,-.65,0],radius=.13,color=CYAN)
        sub=self.small("diffusion lets one region trigger its neighbor")
        self.play(FadeIn(VGroup(dish,grid,title,sub,cue),run_time=.55))
        self.add(ring,wake)
        self.play(r.animate.set_value(4.8),run_time=7.72,rate_func=linear)
        self.play(FadeOut(VGroup(dish,grid,title,sub,cue,ring,wake),run_time=.45))

    def beat5_spiral(self):
        title=self.label("A SPIRAL IS BORN", MAGENTA)
        dish=self.dish(3.55,-.15)
        theta=ValueTracker(0); growth=ValueTracker(.2)
        broken=always_redraw(lambda: Arc(radius=1.65+growth.get_value(),start_angle=.25+theta.get_value(),angle=1.52*PI,color=GOLD,stroke_width=8).move_to([-.55,-.15,0]))
        spiral=always_redraw(lambda: ParametricFunction(lambda u: np.array([
            .38 + (0.08+.105*u)*np.cos(u+theta.get_value()),
            -.25 + (0.08+.105*u)*np.sin(u+theta.get_value()),0]),
            t_range=[0,7.2*PI,.055],color=MAGENTA,stroke_width=6))
        satellite=always_redraw(lambda: ParametricFunction(lambda u: np.array([
            -1.45 + (0.07+.083*u)*np.cos(u-theta.get_value()*1.15+2.2),
            1.0 + (0.07+.083*u)*np.sin(u-theta.get_value()*1.15+2.2),0]),
            t_range=[0,5.2*PI,.06],color=CYAN,stroke_width=4.6).set_stroke(opacity=.72))
        sub=self.small("a broken wavefront curls around its open end")
        self.play(FadeIn(VGroup(dish,title,sub),run_time=.55))
        self.add(broken,spiral,satellite)
        self.play(growth.animate.set_value(.6),theta.animate.set_value(1.8),run_time=6.8,rate_func=linear)
        self.play(FadeOut(VGroup(dish,title,sub,broken,spiral,satellite),run_time=.45))

    def beat6_excitation(self):
        title=self.label("INFORMATION TRAVELS", CYAN)
        dish=self.dish(3.55,-.15)
        sites=[]
        for yy in np.linspace(-2.45,2.05,10):
            for xx in np.linspace(-2.55,2.55,11):
                if xx*xx+(yy+.15)**2 < 8.4:
                    d=Dot([xx,yy-.15,0],radius=.065,color=BLUE,fill_opacity=.28)
                    sites.append((d,xx,yy-.15))
        vg=VGroup(*[d for d,_,_ in sites])
        p=ValueTracker(-3.7)
        for d,x,y in sites:
            d.add_updater(lambda m,x=x,y=y: m.set_color(hex_interp(BLUE,GOLD,np.exp(-((np.hypot(x+1.0,y+.45)-p.get_value())/.32)**2))).set_opacity(.25+.72*np.exp(-((np.hypot(x+1.0,y+.45)-p.get_value())/.38)**2)))
        anchor=Dot([-1.0,-.45,0],radius=.11,color=MAGENTA)
        noflow=Text("NO BULK FLOW",font="DejaVu Sans",weight=BOLD,color=MUTED).scale(.32).move_to([0,-5.85,0])
        sub=self.small("the liquid stays put while excitation passes from patch to patch",y=-6.55)
        self.play(FadeIn(VGroup(dish,title,vg,anchor,noflow,sub),run_time=.55))
        self.play(p.animate.set_value(4.5),run_time=7.22,rate_func=linear)
        vg.clear_updaters()
        self.play(FadeOut(VGroup(dish,title,vg,anchor,noflow,sub),run_time=.45))

    def beat7_domino(self):
        title=self.label("CHEMICAL DOMINOES", GOLD)
        dots=VGroup()
        N=24
        for i in range(N):
            a=2*PI*i/N
            dots.add(RoundedRectangle(width=.32,height=.62,corner_radius=.08,stroke_width=2.2,stroke_color=BLUE,fill_color="#102046",fill_opacity=.8).rotate(a+PI/2).move_to([2.75*np.cos(a),2.75*np.sin(a)-.2,0]))
        q=ValueTracker(0)
        for i,d in enumerate(dots):
            d.add_updater(lambda m,i=i: m.set_fill(hex_interp("#102046",MAGENTA,np.exp(-(((i-q.get_value()+N/2)%N-N/2)/2.2)**2)),opacity=.9))
        center=Text("state → trigger → recover",font="DejaVu Sans",color=INK).scale(.34).move_to([0,-.2,0])
        sub=self.small("one patch switches, nudges its neighbor, then resets")
        self.play(FadeIn(VGroup(title,dots,center,sub),run_time=.45))
        self.play(q.animate.set_value(26),run_time=4.45,rate_func=linear)
        dots.clear_updaters()
        self.play(FadeOut(VGroup(title,dots,center,sub),run_time=.38))

    def beat8_payoff(self):
        title=self.label("FAR FROM EQUILIBRIUM", GOLD)
        dish=self.dish(3.6,-.15)
        t=ValueTracker(0)
        left=always_redraw(lambda: Circle(radius=.45+1.55*t.get_value(),stroke_color=CYAN,stroke_width=6,stroke_opacity=.88).move_to([-1.55,-.2,0]))
        right=always_redraw(lambda: Circle(radius=.45+1.55*t.get_value(),stroke_color=MAGENTA,stroke_width=6,stroke_opacity=.88).move_to([1.55,-.2,0]))
        spiral=always_redraw(lambda: ParametricFunction(lambda u: np.array([
            .05+(0.06+.095*u)*np.cos(u+2.3*t.get_value()),
            1.0+(0.06+.095*u)*np.sin(u+2.3*t.get_value()),0]),
            t_range=[0,5.7*PI,.06],color=GOLD,stroke_width=4.8).set_stroke(opacity=.75))
        foot=self.small("oscillate • propagate • curl • collide • recover")
        self.play(FadeIn(VGroup(dish,title,foot),run_time=.45))
        self.add(left,right,spiral)
        self.play(t.animate.set_value(1),run_time=4.0,rate_func=linear)
        seam=Line([0,-2.6,0],[0,2.2,0],color=INK,stroke_width=2,stroke_opacity=.0)
        self.play(seam.animate.set_stroke(opacity=.35),run_time=.28)
        self.play(FadeOut(VGroup(left,right,spiral,seam),run_time=.3))
        final=Text("moving patterns from local chemical feedback",font="DejaVu Sans",weight=BOLD,color=INK).scale(.34).move_to([0,-.15,0])
        self.play(FadeIn(final,run_time=.25))
        self.wait(.10)
        self.play(FadeOut(VGroup(dish,title,foot,final),run_time=.20))
