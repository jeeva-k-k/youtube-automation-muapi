from manim import *
import numpy as np

config.pixel_width = 1440
config.pixel_height = 2560
config.frame_rate = 60
config.background_color = "#05070c"
config.frame_width = 9
config.frame_height = 16

INK = "#F4F7FF"
CYAN = "#7DEBFF"
TEAL = "#2CD6C4"
MAGENTA = "#FF4FA3"
ORANGE = "#FFB15C"
BLUE = "#3A68FF"
DARK = "#09101B"


def spiral_points(turns=2.8, phase=0.0, scale=1.0, center=np.array([0.0,0.0,0.0]), n=420):
    th = np.linspace(0.15, turns*TAU, n)
    r = scale*(0.10 + 0.055*th)
    x = r*np.cos(th+phase)
    y = r*np.sin(th+phase)
    return np.column_stack((x,y,np.zeros_like(x))) + center


def make_spiral(turns=2.8, phase=0.0, scale=1.0, center=np.array([0.0,0.0,0.0]), color=MAGENTA, width=10):
    pts = spiral_points(turns, phase, scale, center)
    m = VMobject(stroke_color=color, stroke_width=width)
    m.set_points_smoothly(pts)
    return m


class C218Pilot(Scene):
    def construct(self):
        # static environment
        bg = Rectangle(width=9, height=16, fill_color="#05070c", fill_opacity=1, stroke_width=0)
        vignette = Circle(radius=4.6, fill_color="#0B1830", fill_opacity=0.34, stroke_width=0).scale(1.15).shift(UP*0.6)
        self.add(bg, vignette)

        title = Text("CHEMISTRY MAKES WAVES", font_size=54, weight=BOLD, color=INK).to_edge(UP, buff=0.7)
        sub = Text("Belousov–Zhabotinsky reaction", font_size=28, color=CYAN).next_to(title, DOWN, buff=0.18)

        dish_r = 3.35
        dish = Circle(radius=dish_r, fill_color="#0A1020", fill_opacity=1, stroke_color="#8DE8FF", stroke_width=7).shift(DOWN*0.65)
        glass = Circle(radius=dish_r*0.94, fill_color="#111B32", fill_opacity=0.76, stroke_color="#D6F8FF", stroke_width=2).move_to(dish)
        rim_glow = Circle(radius=dish_r*1.02, stroke_color=CYAN, stroke_width=2, stroke_opacity=0.35).move_to(dish)
        self.play(FadeIn(dish, glass, rim_glow), Write(title), FadeIn(sub), run_time=1.2)

        # Beat 1: spirals bloom
        spirals = VGroup()
        centers = [dish.get_center()+LEFT*1.15+UP*0.8, dish.get_center()+RIGHT*1.2+DOWN*0.3, dish.get_center()+LEFT*0.2+DOWN*1.25]
        phases = [0.1, 2.3, 4.1]
        colors = [MAGENTA, ORANGE, TEAL]
        for c,p,col in zip(centers, phases, colors):
            s = make_spiral(turns=2.4, phase=p, scale=0.9, center=c, color=col, width=11)
            s.set_stroke(opacity=0.95)
            spirals.add(s)
        self.play(LaggedStart(*[Create(s) for s in spirals], lag_ratio=0.12), run_time=2.2)
        phase = ValueTracker(0)
        for idx,s in enumerate(spirals):
            c=centers[idx]; p=phases[idx]; col=colors[idx]
            s.add_updater(lambda mob, dt, c=c, p=p, col=col: mob.become(make_spiral(2.4, p+phase.get_value(), 0.9, c, col, 11)))
        self.play(phase.animate.set_value(1.7), run_time=2.6, rate_func=linear)
        for s in spirals: s.clear_updaters()

        # Beat 2: temporal oscillation in a well-mixed patch
        self.play(FadeOut(spirals), FadeOut(sub), Transform(title, Text("NOT A ONE-WAY FADE", font_size=52, weight=BOLD, color=INK).to_edge(UP,buff=0.72)), run_time=0.7)
        sample = Circle(radius=1.55, fill_color=BLUE, fill_opacity=0.85, stroke_color=INK, stroke_width=4).move_to(dish.get_center())
        osc = ValueTracker(0)
        def oscillate(m):
            a=(np.sin(osc.get_value())+1)/2
            # blend by replacing with two semi-transparent layers
            m.set_fill(color=interpolate_color(BLUE, MAGENTA, a), opacity=0.9)
        sample.add_updater(oscillate)
        self.play(FadeIn(sample), run_time=0.4)
        self.play(osc.animate.set_value(TAU*2.5), run_time=5.0, rate_func=linear)
        sample.clear_updaters()

        # Beat 3: feedback network
        self.play(FadeOut(sample), Transform(title, Text("FEEDBACK CHANGES THE STATE", font_size=48, weight=BOLD, color=INK).to_edge(UP,buff=0.72)), run_time=0.7)
        nodes = VGroup(*[
            Circle(radius=0.48, fill_color=c, fill_opacity=0.95, stroke_color=INK, stroke_width=2)
            for c in [CYAN, MAGENTA, ORANGE]
        ]).arrange(RIGHT, buff=0.85).move_to(dish.get_center()+UP*0.2)
        labels = VGroup(Text("A",font_size=30,color=DARK),Text("B",font_size=30,color=DARK),Text("C",font_size=30,color=DARK))
        for lab,node in zip(labels,nodes): lab.move_to(node)
        arrows = VGroup(
            Arrow(nodes[0].get_right(),nodes[1].get_left(),buff=0.12,color=CYAN,stroke_width=6,max_tip_length_to_length_ratio=0.16),
            Arrow(nodes[1].get_right(),nodes[2].get_left(),buff=0.12,color=MAGENTA,stroke_width=6,max_tip_length_to_length_ratio=0.16),
            CurvedArrow(nodes[2].get_bottom()+DOWN*0.05,nodes[0].get_bottom()+DOWN*0.05,angle=-PI/2,color=ORANGE,stroke_width=6)
        )
        self.play(LaggedStart(*[GrowFromCenter(n) for n in nodes], lag_ratio=0.15), FadeIn(labels), Create(arrows), run_time=1.4)
        self.play(Indicate(nodes[0],scale_factor=1.18),Indicate(nodes[1],scale_factor=1.18),Indicate(nodes[2],scale_factor=1.18), run_time=1.1)
        self.play(Indicate(nodes[2],color=ORANGE),Indicate(nodes[0],color=CYAN), run_time=1.1)
        self.wait(1.3)

        # Beat 4: circular reaction front
        self.play(FadeOut(nodes,labels,arrows), Transform(title, Text("A REACTION FRONT", font_size=54, weight=BOLD, color=INK).to_edge(UP,buff=0.72)), run_time=0.7)
        seed = Dot(dish.get_center()+LEFT*1.1+UP*0.45, radius=0.09, color=ORANGE)
        front = Circle(radius=0.12, stroke_color=ORANGE, stroke_width=14).move_to(seed)
        glow = Circle(radius=0.12, stroke_color=ORANGE, stroke_width=28, stroke_opacity=0.17).move_to(seed)
        self.play(FadeIn(seed), run_time=0.2)
        self.add(glow,front)
        self.play(front.animate.scale(18), glow.animate.scale(18), FadeOut(seed), run_time=4.2, rate_func=linear)
        self.play(FadeOut(front,glow), run_time=0.3)

        # Beat 5: propagation without bulk liquid motion
        self.play(Transform(title, Text("INFORMATION TRAVELS", font_size=52, weight=BOLD, color=INK).to_edge(UP,buff=0.72)), run_time=0.5)
        stationary = VGroup(*[Dot(radius=0.025,color="#7D8AA5",fill_opacity=0.45) for _ in range(95)])
        rng=np.random.default_rng(8)
        for d in stationary:
            while True:
                x,y=rng.uniform(-dish_r*0.82,dish_r*0.82,2)
                if x*x+y*y < (dish_r*0.82)**2:
                    d.move_to(dish.get_center()+RIGHT*x+UP*y); break
        self.add(stationary)
        moving_front = Circle(radius=0.25, stroke_color=TEAL, stroke_width=12).move_to(dish.get_center()+RIGHT*0.3+UP*0.15)
        self.play(Create(moving_front), run_time=0.4)
        self.play(moving_front.animate.scale(10.2), run_time=4.2, rate_func=linear)
        note = Text("molecules stay local", font_size=28, color="#B8C5D9").next_to(dish,DOWN,buff=0.35)
        self.play(FadeIn(note), run_time=0.3)
        self.wait(1.0)
        self.play(FadeOut(moving_front,note,stationary), run_time=0.4)

        # Beat 6: broken front curls to spiral
        self.play(Transform(title, Text("A SPIRAL IS BORN", font_size=54, weight=BOLD, color=INK).to_edge(UP,buff=0.72)), run_time=0.5)
        arc = Arc(radius=2.05,start_angle=-0.85*PI,angle=1.55*PI,stroke_color=MAGENTA,stroke_width=14).move_to(dish)
        self.play(Create(arc),run_time=1.3)
        target = make_spiral(turns=2.7, phase=0.0, scale=1.0, center=dish.get_center(), color=MAGENTA, width=14)
        self.play(Transform(arc,target),run_time=2.2)
        rot=ValueTracker(0)
        arc.add_updater(lambda m,dt: m.become(make_spiral(2.7,rot.get_value(),1.0,dish.get_center(),MAGENTA,14)))
        self.play(rot.animate.set_value(1.9),run_time=3.2,rate_func=linear)
        arc.clear_updaters()

        # Beat 7: traffic wave analogy
        self.play(FadeOut(arc),Transform(title, Text("A CHEMICAL TRAFFIC WAVE", font_size=44, weight=BOLD, color=INK).to_edge(UP,buff=0.72)),run_time=0.5)
        lane=Line(dish.get_left()+RIGHT*0.45,dish.get_right()+LEFT*0.45,color="#32415B",stroke_width=10)
        cars=VGroup(*[RoundedRectangle(width=0.44,height=0.24,corner_radius=0.06,fill_color=TEAL if i<5 else ORANGE,fill_opacity=1,stroke_width=0) for i in range(9)])
        cars.arrange(RIGHT,buff=0.16).move_to(dish.get_center())
        self.play(Create(lane),FadeIn(cars),run_time=0.5)
        self.play(*[c.animate.shift((RIGHT if i<5 else LEFT)*0.25) for i,c in enumerate(cars)],run_time=1.2)
        self.play(FadeOut(lane,cars),run_time=0.3)

        # Beat 8: multiple fronts collide and annihilate
        self.play(Transform(title, Text("FAR FROM EQUILIBRIUM", font_size=50, weight=BOLD, color=INK).to_edge(UP,buff=0.72)),run_time=0.5)
        left = Circle(radius=0.22,stroke_color=CYAN,stroke_width=13).move_to(dish.get_center()+LEFT*1.65)
        right = Circle(radius=0.22,stroke_color=ORANGE,stroke_width=13).move_to(dish.get_center()+RIGHT*1.65)
        upper = Circle(radius=0.22,stroke_color=MAGENTA,stroke_width=13).move_to(dish.get_center()+UP*1.45)
        self.add(left,right,upper)
        self.play(left.animate.scale(7.5), right.animate.scale(7.5), upper.animate.scale(7.5), run_time=4.2, rate_func=linear)
        collision = Dot(dish.get_center(),radius=0.16,color=INK)
        self.play(FadeIn(collision,scale=2.5), FadeOut(left,right,upper), run_time=0.55)
        self.play(collision.animate.scale(5).set_opacity(0), run_time=0.7)
        final_spiral=make_spiral(turns=3.15,phase=0.3,scale=1.0,center=dish.get_center(),color=CYAN,width=12)
        final_spiral2=make_spiral(turns=2.45,phase=2.8,scale=0.76,center=dish.get_center()+LEFT*0.7+DOWN*0.3,color=MAGENTA,width=9)
        self.play(Create(final_spiral),Create(final_spiral2),run_time=1.4)
        outro=Text("STATE → FRONT → SPIRAL",font_size=38,weight=BOLD,color=INK).next_to(dish,DOWN,buff=0.38)
        self.play(FadeIn(outro),run_time=0.35)
        self.wait(1.6)
