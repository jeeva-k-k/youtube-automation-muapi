from functools import lru_cache
from manim import *
import numpy as np
from scipy.integrate import solve_ivp

config.frame_width = 9
config.frame_height = 16
config.background_color = "#040714"

BG = "#040714"
INK = "#F3F7FF"
MUTED = "#8EA3C6"
CYAN = "#19DDD1"
MAGENTA = "#FA438C"
GOLD = "#FFD15C"
BLUE = "#4F7DFF"
DARK = "#0A1530"


def clamp01(x):
    return max(0.0, min(1.0, float(x)))


def hex_interp(c0, c1, a):
    a = clamp01(a)
    a0 = np.array([int(c0[i:i+2], 16) for i in (1, 3, 5)], dtype=float)
    a1 = np.array([int(c1[i:i+2], 16) for i in (1, 3, 5)], dtype=float)
    c = np.round(a0 * (1 - a) + a1 * a).astype(int)
    return "#%02X%02X%02X" % tuple(c)


def _rgba_from_state(u, v, xx, yy):
    base = np.array([4.0, 8.0, 24.0])
    mag = np.array([250.0, 66.0, 142.0])
    cyan = np.array([20.0, 221.0, 208.0])
    gold = np.array([255.0, 210.0, 82.0])
    rgb = base + (u[..., None] ** 1.35) * (mag - base) * 0.90
    rgb += (v[..., None] ** 1.30) * (cyan - base) * 0.34
    front = np.exp(-((u - 0.50) / 0.115) ** 2) * (u > 0.07)
    rgb = rgb * (1 - 0.72 * front[..., None]) + gold * (0.72 * front[..., None])
    radius = np.hypot(xx, yy)
    liquid = np.clip(1.02 - 0.13 * radius**2, 0.84, 1.02)
    caustic = 1.0 + 0.025 * np.sin(14 * xx + 5 * yy) + 0.018 * np.sin(10 * yy - 3 * xx)
    rgb *= (liquid * caustic)[..., None]
    alpha = np.clip((0.985 - radius) / 0.018, 0, 1) * 255
    rgba = np.zeros((*u.shape, 4), dtype=np.uint8)
    rgba[..., :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    rgba[..., 3] = alpha.astype(np.uint8)
    return rgba


@lru_cache(maxsize=3)
def barkley_frames(kind):
    n = 176
    y, x = np.mgrid[-1:1:complex(n), -1:1:complex(n)]
    u = np.zeros((n, n), dtype=np.float32)
    v = np.zeros_like(u)
    if kind == "spiral":
        u[:, : n // 2] = 1.0
        v[: n // 2, :] = 1.0
        total, start, every = 4300, 260, 18
    elif kind == "multi":
        for cx, cy in [(-0.42, -0.22), (0.38, -0.18), (0.02, 0.44)]:
            u[(x - cx) ** 2 + (y - cy) ** 2 < 0.050**2] = 1.0
        total, start, every = 3200, 0, 15
    else:
        raise ValueError(kind)
    a, b, eps, dt = 0.75, 0.06, 0.02, 0.005
    out = []
    for step in range(total + 1):
        lap = np.roll(u, 1, 0) + np.roll(u, -1, 0) + np.roll(u, 1, 1) + np.roll(u, -1, 1) - 4 * u
        u += dt * (u * (1 - u) * (u - (v + b) / a) / eps + lap)
        v += dt * (u - v)
        np.clip(u, 0, 1, out=u)
        np.clip(v, 0, 1, out=v)
        if step >= start and (step - start) % every == 0:
            out.append(_rgba_from_state(u, v, x, y))
    return tuple(out)


class C218Scene(Scene):
    def construct(self):
        self.camera.background_color = BG
        self.add(self.background())
        self.beat1_hook()
        self.beat2_oscillator()
        self.beat3_catalyst()
        self.beat4_front()
        self.beat5_spiral()
        self.beat6_noflow()
        self.beat7_excitation()
        self.beat8_payoff()

    def background(self):
        g = VGroup()
        g.add(Circle(7.8, stroke_color=BLUE, stroke_width=1.2, stroke_opacity=0.055))
        g.add(Circle(6.1, stroke_color=CYAN, stroke_width=1.0, stroke_opacity=0.035))
        g.add(Circle(4.75, stroke_color=MAGENTA, stroke_width=0.8, stroke_opacity=0.025))
        rng = np.random.default_rng(218)
        for _ in range(54):
            g.add(Dot([rng.uniform(-4.15, 4.15), rng.uniform(-7.7, 7.7), 0], radius=rng.uniform(0.006, 0.022), color=hex_interp(BLUE, CYAN, rng.random()), fill_opacity=rng.uniform(0.10, 0.32)))
        return g

    def title(self, text, color=INK, y=6.55, scale=0.43):
        label = Text(text, font="DejaVu Sans", weight=BOLD, color=color).scale(scale).move_to([0, y, 0])
        bar = Line([-1.25, y - 0.48, 0], [1.25, y - 0.48, 0], color=color, stroke_width=2.2, stroke_opacity=0.45)
        return VGroup(label, bar)

    def small(self, text, y=-6.62, color=MUTED, scale=0.29):
        return Text(text, font="DejaVu Sans", color=color).scale(scale).move_to([0, y, 0])

    def dish_shell(self, radius=3.52, y=-0.25):
        shadow = Circle(radius * 1.035, stroke_width=0, fill_color="#01030B", fill_opacity=0.42).move_to([0, y - 0.07, 0])
        glow = Circle(radius * 1.018, stroke_color=CYAN, stroke_width=8, stroke_opacity=0.13).move_to([0, y, 0])
        rim = Circle(radius, stroke_color="#D5F5FF", stroke_width=4.2, fill_opacity=0).move_to([0, y, 0])
        inner = Circle(radius * 0.972, stroke_color=BLUE, stroke_width=1.6, stroke_opacity=0.32).move_to([0, y, 0])
        highlight = Arc(radius=radius * 0.985, start_angle=0.60 * PI, angle=0.52 * PI, stroke_color=WHITE, stroke_width=5.5, stroke_opacity=0.35).move_to([0, y, 0])
        return VGroup(shadow, glow, rim, inner, highlight)

    def field_image(self, frames, tracker, width=6.84, y=-0.25, lo=0.0, hi=1.0):
        img = ImageMobject(frames[0], pixel_array_dtype="uint8").set_resampling_algorithm(RESAMPLING_ALGORITHMS["cubic"])
        img.set_width(width).move_to([0, y, 0])
        def update(mob):
            a = clamp01(tracker.get_value())
            idx = int(round((lo + (hi - lo) * a) * (len(frames) - 1)))
            arr = frames[max(0, min(len(frames) - 1, idx))]
            mob.pixel_array = arr
            mob.orig_alpha_pixel_array = arr[..., 3]
            return mob
        img.add_updater(update)
        return img

    def beat1_hook(self):
        frames = barkley_frames("spiral")
        p = ValueTracker(0)
        liquid = self.field_image(frames, p, lo=0.46, hi=1.0)
        shell = self.dish_shell()
        head = self.title("CHEMISTRY MAKES WAVES", GOLD)
        sub = self.small("an unstirred liquid can organize moving spiral fronts", y=-6.45, scale=0.27)
        badge = Text("UNSTIRRED", font="DejaVu Sans", weight=BOLD, color=CYAN).scale(0.25).move_to([0, 4.65, 0])
        badge_box = SurroundingRectangle(badge, buff=0.14, corner_radius=0.12, color=CYAN, stroke_width=1.6, fill_color=DARK, fill_opacity=0.75)
        self.play(FadeIn(VGroup(shell, head, sub, badge_box, badge), run_time=0.50), FadeIn(liquid, run_time=0.50))
        self.play(p.animate.set_value(1), run_time=3.80, rate_func=linear)
        liquid.clear_updaters()
        self.play(FadeOut(VGroup(shell, head, sub, badge_box, badge, liquid), run_time=0.37))

    def beat2_oscillator(self):
        head = self.title("AN OSCILLATING REACTION", CYAN)
        def ode(t, z):
            x, y = z
            return [x - x**3 / 3 - y + 0.55, 0.08 * (x + 0.7 - 0.8 * y)]
        ts = np.linspace(0, 60, 3001)
        solve_ivp(ode, (0, 60), [-1, 1], t_eval=ts, rtol=1e-7, atol=1e-9)
        phase = ValueTracker(0)
        nodes = VGroup(*[Circle(0.56, color=c, stroke_width=3.2, fill_color=c, fill_opacity=0.12) for c in (CYAN, MAGENTA, GOLD)])
        nodes.arrange(RIGHT, buff=0.62).move_to([0, 1.8, 0])
        node_txt = VGroup(*[Text(s, font="DejaVu Sans", weight=BOLD, color=INK).scale(0.30).move_to(n) for s, n in zip(("STATE A", "STATE B", "STATE C"), nodes)])
        arrows = VGroup(Arrow(nodes[0].get_right(), nodes[1].get_left(), buff=0.08, color=MUTED, stroke_width=3), Arrow(nodes[1].get_right(), nodes[2].get_left(), buff=0.08, color=MUTED, stroke_width=3), CurvedArrow(nodes[2].get_bottom() + DOWN * 0.10, nodes[0].get_bottom() + DOWN * 0.10, angle=-PI / 2, color=BLUE, stroke_width=3))
        axes = Axes(x_range=[0, 10, 2], y_range=[-2.1, 2.1, 1], x_length=6.8, y_length=3.5, tips=False, axis_config={"stroke_width": 2, "stroke_opacity": 0.35}).move_to([0, -2.25, 0])
        curve = always_redraw(lambda: axes.plot(lambda x: 1.35 * np.sin(0.92 * x + 10.0 * phase.get_value()) + 0.16 * np.sin(2.55 * x), x_range=[0, 10, 0.04], color=CYAN, stroke_width=4.3))
        cursor = always_redraw(lambda: Dot(axes.c2p(5.0, 1.35 * np.sin(4.6 + 10.0 * phase.get_value()) + 0.16 * np.sin(12.75)), radius=0.085, color=GOLD))
        halo = always_redraw(lambda: Circle(0.58 + 0.10 * (1 + np.sin(10 * phase.get_value())), stroke_color=MAGENTA, stroke_width=5, stroke_opacity=0.34).move_to(nodes[int((phase.get_value() * 12) % 3)].get_center()))
        words = VGroup(Text("not a one-way fade", font="DejaVu Sans", weight=BOLD, color=MAGENTA).scale(0.34), Text("feedback changes which state dominates", font="DejaVu Sans", color=MUTED).scale(0.28)).arrange(DOWN, buff=0.22).move_to([0, -5.15, 0])
        group = VGroup(head, nodes, node_txt, arrows, axes, words)
        self.play(FadeIn(group, run_time=0.50))
        self.add(curve, cursor, halo)
        self.play(phase.animate.set_value(1), run_time=12.60, rate_func=linear)
        self.play(FadeOut(VGroup(group, curve, cursor, halo), run_time=0.46))

    def beat3_catalyst(self):
        head = self.title("COLOR MAKES THE CYCLE VISIBLE", MAGENTA, scale=0.39)
        shell = self.dish_shell(3.45)
        state = ValueTracker(0)
        liquid = always_redraw(lambda: Circle(3.30, fill_color=hex_interp(CYAN, MAGENTA, 0.5 + 0.5 * np.sin(state.get_value())), fill_opacity=0.70, stroke_width=0).move_to([0, -0.25, 0]))
        metal = Circle(0.48, color=GOLD, stroke_width=4.2, fill_color="#241B0C", fill_opacity=0.82).move_to([0, -0.25, 0])
        mtxt = Text("M", font="DejaVu Sans", weight=BOLD, color=GOLD).scale(0.40).move_to(metal)
        ligands = VGroup()
        for a in np.linspace(0, TAU, 6, endpoint=False):
            p1 = metal.get_center() + 0.52 * np.array([np.cos(a), np.sin(a), 0])
            p2 = metal.get_center() + 1.10 * np.array([np.cos(a), np.sin(a), 0])
            ligands.add(Line(p1, p2, color=INK, stroke_width=2.7, stroke_opacity=0.75), Dot(p2, radius=0.10, color=CYAN))
        pulse = always_redraw(lambda: Circle(0.74 + 0.18 * (0.5 + 0.5 * np.sin(state.get_value())), color=GOLD, stroke_width=4.5, stroke_opacity=0.35).move_to(metal))
        ox = Text("OXIDIZED", font="DejaVu Sans", weight=BOLD, color=MAGENTA).scale(0.31).move_to([0, -4.8, 0])
        red = Text("REDUCED", font="DejaVu Sans", weight=BOLD, color=CYAN).scale(0.31).move_to([0, -4.8, 0])
        ox.add_updater(lambda m: m.set_opacity(0.18 + 0.82 * clamp01(0.5 + 0.5 * np.sin(state.get_value()))))
        red.add_updater(lambda m: m.set_opacity(0.18 + 0.82 * clamp01(0.5 - 0.5 * np.sin(state.get_value()))))
        sub = self.small("a color-changing metal catalyst reports the chemical state")
        self.add(liquid)
        self.play(FadeIn(VGroup(shell, head, metal, mtxt, ligands, pulse, ox, red, sub), run_time=0.45))
        self.play(state.animate.set_value(4.7 * PI), run_time=5.25, rate_func=linear)
        ox.clear_updaters(); red.clear_updaters(); liquid.clear_updaters(); pulse.clear_updaters()
        self.play(FadeOut(VGroup(shell, head, metal, mtxt, ligands, pulse, ox, red, sub, liquid), run_time=0.35))

    def beat4_front(self):
        head = self.title("DIFFUSION PASSES THE STATE", GOLD, scale=0.39)
        shell = self.dish_shell()
        grid = VGroup()
        points = []
        for yy in np.linspace(-2.5, 2.0, 10):
            for xx in np.linspace(-2.55, 2.55, 11):
                if xx * xx + (yy + 0.25) ** 2 < 8.3:
                    d = Dot([xx, yy - 0.25, 0], radius=0.055, color=BLUE, fill_opacity=0.30)
                    grid.add(d); points.append((d, xx, yy - 0.25))
        r = ValueTracker(0.06)
        cx, cy = -1.05, -0.55
        for d, x, y in points:
            dist = np.hypot(x - cx, y - cy)
            d.add_updater(lambda m, dist=dist: m.set_color(hex_interp(BLUE, GOLD, np.exp(-((dist - r.get_value()) / 0.28) ** 2))).set_opacity(0.24 + 0.74 * np.exp(-((dist - r.get_value()) / 0.34) ** 2)))
        front = always_redraw(lambda: Circle(max(0.05, r.get_value()), stroke_color=GOLD, stroke_width=7.0, stroke_opacity=0.82).move_to([cx, cy, 0]))
        wake = always_redraw(lambda: Circle(max(0.04, r.get_value() - 0.23), stroke_color=MAGENTA, stroke_width=3.4, stroke_opacity=0.46).move_to([cx, cy, 0]))
        seed = Dot([cx, cy, 0], radius=0.13, color=CYAN)
        arrows = VGroup(*[Arrow([cx + a, cy, 0], [cx + a + 0.42, cy, 0], buff=0.03, color=CYAN, stroke_width=2.4, max_tip_length_to_length_ratio=0.23) for a in (-0.1, 0.75, 1.6)])
        sub = self.small("each excited patch helps trigger the next nearby patch")
        self.play(FadeIn(VGroup(shell, head, grid, seed, arrows, sub), run_time=0.45))
        self.add(front, wake)
        self.play(r.animate.set_value(4.75), run_time=9.05, rate_func=linear)
        for d, _, _ in points: d.clear_updaters()
        front.clear_updaters(); wake.clear_updaters()
        self.play(FadeOut(VGroup(shell, head, grid, seed, arrows, sub, front, wake), run_time=0.39))

    def beat5_spiral(self):
        frames = barkley_frames("spiral")
        p = ValueTracker(0)
        liquid = self.field_image(frames, p, lo=0.02, hi=0.78)
        shell = self.dish_shell()
        head = self.title("BROKEN FRONT → ROTATING SPIRAL", MAGENTA, scale=0.37)
        tip = Dot([0.02, -0.15, 0], radius=0.12, color=GOLD)
        curved = CurvedArrow([0.25, 1.35, 0], [1.25, 0.75, 0], angle=-0.8, color=GOLD, stroke_width=3.5)
        call = Text("open end curls", font="DejaVu Sans", weight=BOLD, color=GOLD).scale(0.28).next_to(curved, RIGHT, buff=0.12)
        sub = self.small("a broken reaction front can organize itself into a spiral")
        self.play(FadeIn(VGroup(shell, head, tip, curved, call, sub), run_time=0.40), FadeIn(liquid, run_time=0.40))
        self.play(p.animate.set_value(1), run_time=6.30, rate_func=linear)
        liquid.clear_updaters()
        self.play(FadeOut(VGroup(shell, head, tip, curved, call, sub, liquid), run_time=0.33))

    def beat6_noflow(self):
        frames = barkley_frames("spiral")
        p = ValueTracker(0)
        liquid = self.field_image(frames, p, lo=0.45, hi=1.0)
        shell = self.dish_shell()
        head = self.title("THE PATTERN MOVES — THE LIQUID DOESN'T", CYAN, scale=0.32)
        tracers = VGroup()
        for a in np.linspace(0, TAU, 14, endpoint=False):
            rr = 2.25 + 0.22 * np.sin(3 * a)
            pos = [rr * np.cos(a), rr * np.sin(a) - 0.25, 0]
            tracers.add(Cross(scale_factor=0.085, stroke_color=INK, stroke_width=2.4, stroke_opacity=0.65).move_to(pos))
        badge = Text("FIXED TRACERS", font="DejaVu Sans", weight=BOLD, color=INK).scale(0.27).move_to([0, -5.62, 0])
        box = SurroundingRectangle(badge, buff=0.14, color=INK, corner_radius=0.10, stroke_width=1.5, fill_color=DARK, fill_opacity=0.76)
        sub = self.small("chemical excitation travels; these spatial markers never translate")
        self.play(FadeIn(VGroup(shell, head, tracers, box, badge, sub), run_time=0.40), FadeIn(liquid, run_time=0.40))
        self.play(p.animate.set_value(1), run_time=6.10, rate_func=linear)
        liquid.clear_updaters()
        self.play(FadeOut(VGroup(shell, head, tracers, box, badge, sub, liquid), run_time=0.30))

    def beat7_excitation(self):
        head = self.title("EXCITE → TRIGGER → RECOVER", GOLD, scale=0.37)
        blocks = VGroup()
        n = 13
        for i in range(n):
            x = -3.15 + i * (6.30 / (n - 1))
            y = 0.34 * np.sin(i * 0.64) - 0.25
            blocks.add(RoundedRectangle(width=0.34, height=0.62, corner_radius=0.09, stroke_color=BLUE, stroke_width=2.2, fill_color="#102044", fill_opacity=0.88).move_to([x, y, 0]))
        q = ValueTracker(-1)
        for i, b in enumerate(blocks):
            b.add_updater(lambda m, i=i: m.set_fill(hex_interp("#102044", MAGENTA, np.exp(-((i - q.get_value()) / 1.45) ** 2)), opacity=0.92).set_stroke(hex_interp(BLUE, GOLD, np.exp(-((i - q.get_value()) / 1.15) ** 2))))
        arrows = VGroup()
        for a, b in zip(blocks[:-1], blocks[1:]):
            arrows.add(Arrow(a.get_right(), b.get_left(), buff=0.05, color=MUTED, stroke_width=2.0, max_tip_length_to_length_ratio=0.28))
        analogy = Text("like dominoes — except every patch resets", font="DejaVu Sans", color=CYAN).scale(0.30).move_to([0, -2.35, 0])
        sub = self.small("the moving signal is a sequence of local state changes")
        self.play(FadeIn(VGroup(head, blocks, arrows, analogy, sub), run_time=0.35))
        self.play(q.animate.set_value(n + 1), run_time=3.80, rate_func=linear)
        for b in blocks: b.clear_updaters()
        self.play(FadeOut(VGroup(head, blocks, arrows, analogy, sub), run_time=0.33))

    def beat8_payoff(self):
        frames = barkley_frames("multi")
        p = ValueTracker(0)
        liquid = self.field_image(frames, p, lo=0.03, hi=0.94)
        shell = self.dish_shell()
        head = self.title("FRONTS COLLIDE → ANNIHILATE", GOLD, scale=0.37)
        seed_marks = VGroup(*[Dot([x * 3.1, y * 3.1 - 0.25, 0], radius=0.08, color=CYAN, fill_opacity=0.55) for x, y in [(-0.42, -0.22), (0.38, -0.18), (0.02, 0.44)]])
        sub = self.small("waves interact because each region can only be excited, refractory, or recovered", scale=0.255)
        self.play(FadeIn(VGroup(shell, head, seed_marks, sub), run_time=0.35), FadeIn(liquid, run_time=0.35))
        self.play(p.animate.set_value(1), run_time=3.75, rate_func=linear)
        liquid.clear_updaters()
        payoff = VGroup(Text("FAR FROM EQUILIBRIUM", font="DejaVu Sans", weight=BOLD, color=INK).scale(0.40), Text("local feedback creates global moving patterns", font="DejaVu Sans", color=CYAN).scale(0.27)).arrange(DOWN, buff=0.20).move_to([0, 4.72, 0])
        self.play(FadeIn(payoff, shift=DOWN * 0.08, run_time=0.20))
        self.wait(0.28)
        self.play(FadeOut(VGroup(shell, head, seed_marks, sub, liquid, payoff), run_time=0.305))
