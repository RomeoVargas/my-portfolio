"""
Blender World Asset Generator for Romeo's Portfolio
Run this in Blender: File > Scripting tab, open this file, click Run Script.
Generates terrain, buildings, character, and trees, then exports as .glb.

Requirements: Blender 3.6+ (ships with the glTF exporter).
Output: public/models/world.glb
"""
import bpy
import bmesh
import math
import os
from mathutils import Vector

# ---- Config ----
ISLAND_RADIUS = 38
STATIONS = [
    {"name": "Guild",     "pos": (-18, -10), "w": 6,   "d": 6,   "h": 7,  "wall": (0.77, 0.66, 0.51), "roof": (0.55, 0.30, 0.23)},
    {"name": "Workshop",  "pos": (8, -16),   "w": 5.5, "d": 5.5, "h": 8,  "wall": (0.83, 0.72, 0.59), "roof": (0.42, 0.36, 0.30)},
    {"name": "Tavern",    "pos": (20, 2),    "w": 5,   "d": 5,   "h": 6,  "wall": (0.74, 0.64, 0.48), "roof": (0.49, 0.35, 0.23)},
    {"name": "FalconPost","pos": (-10, 14),  "w": 4.5, "d": 4.5, "h": 9,  "wall": (0.78, 0.72, 0.60), "roof": (0.36, 0.29, 0.23)},
    {"name": "Portal",    "pos": (2, -24),   "w": 5,   "d": 5,   "h": 7,  "wall": (0.66, 0.61, 0.78), "roof": (0.42, 0.30, 0.54)},
]
SPAWN = (0, 8)

def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    for c in bpy.data.collections:
        bpy.data.collections.remove(c)

def make_material(name, color, roughness=0.8, emission=None):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs[0].default_value = (*color, 1)
    bsdf.inputs[2].default_value = roughness
    if emission:
        bsdf.inputs[26].default_value = (*emission, 1)
        bsdf.inputs[27].default_value = 3.0
    return mat

def terrain_height(x, y):
    dist = math.sqrt(x * x + y * y)
    if dist > ISLAND_RADIUS + 2:
        return -5
    edge = max(0, 1 - dist / ISLAND_RADIUS)
    e = edge * edge * (3 - 2 * edge)
    h = (math.sin(x * 0.08) * math.cos(y * 0.06) * 3
         + math.sin(x * 0.15 + 1.3) * math.sin(y * 0.18 + 0.7) * 1.5
         + math.cos(x * 0.3 + y * 0.2) * 0.7
         + math.sin(x * 0.5 - y * 0.4 + 2.1) * 0.3)
    for s in STATIONS:
        bd = math.hypot(x - s["pos"][0], y - s["pos"][1])
        if bd < 7:
            t = max(0, (bd - 2) / 5)
            h *= t * t * (3 - 2 * t)
    sd = math.hypot(x - SPAWN[0], y - SPAWN[1])
    if sd < 4:
        h *= sd / 4
    return h * e

def create_terrain():
    bpy.ops.mesh.primitive_plane_add(size=100, location=(0, 0, 0))
    obj = bpy.context.active_object
    obj.name = "Terrain"
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.subdivide(number_cuts=63)
    bpy.ops.object.mode_set(mode='OBJECT')
    for v in obj.data.vertices:
        v.co.z = terrain_height(v.co.x, v.co.y)
    mat = make_material("Grass", (0.3, 0.6, 0.22), roughness=0.92)
    obj.data.materials.append(mat)
    obj.data.update()
    return obj

def create_building(station):
    col = bpy.data.collections.new(station["name"])
    bpy.context.scene.collection.children.link(col)
    px, py = station["pos"]
    w, d, h = station["w"], station["d"], station["h"]
    base_z = terrain_height(px, py)
    angle = math.atan2(SPAWN[0] - px, SPAWN[1] - py)

    wall_mat = make_material(f'{station["name"]}_Wall', station["wall"], roughness=0.85)
    roof_mat = make_material(f'{station["name"]}_Roof', station["roof"], roughness=0.75)
    wood_mat = make_material("Wood", (0.42, 0.26, 0.15), roughness=0.9)
    glow_mat = make_material("WindowGlow", (1, 0.93, 0.67), roughness=0.3, emission=(1, 0.67, 0.27))

    # Foundation
    bpy.ops.mesh.primitive_cube_add(size=1, location=(px, py, base_z + 0.2))
    found = bpy.context.active_object
    found.scale = (w + 0.8, d + 0.8, 0.4)
    found.name = f"{station['name']}_Foundation"
    found.data.materials.append(make_material("Stone", (0.47, 0.47, 0.47), roughness=0.95))
    col.objects.link(found)
    bpy.context.scene.collection.objects.unlink(found)

    # Walls
    bpy.ops.mesh.primitive_cube_add(size=1, location=(px, py, base_z + h / 2 + 0.4))
    walls = bpy.context.active_object
    walls.scale = (w, d, h)
    walls.name = f"{station['name']}_Walls"
    walls.data.materials.append(wall_mat)
    col.objects.link(walls)
    bpy.context.scene.collection.objects.unlink(walls)

    # Roof (pyramid)
    bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=max(w, d) * 0.82, depth=3,
                                     location=(px, py, base_z + h + 1.9))
    roof = bpy.context.active_object
    roof.rotation_euler.z = math.pi / 4
    roof.name = f"{station['name']}_Roof"
    roof.data.materials.append(roof_mat)
    col.objects.link(roof)
    bpy.context.scene.collection.objects.unlink(roof)

    # Door
    bpy.ops.mesh.primitive_cube_add(size=1, location=(px, py + d / 2 + 0.08, base_z + 1.5))
    door = bpy.context.active_object
    door.scale = (1.2, 0.15, 2.2)
    door.name = f"{station['name']}_Door"
    door.data.materials.append(wood_mat)
    col.objects.link(door)
    bpy.context.scene.collection.objects.unlink(door)

    # Windows
    for i, (wx, wy, wz) in enumerate([(-1, d/2 + 0.05, h*0.5 + 0.4), (1, d/2 + 0.05, h*0.5 + 0.4)]):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(px + wx, py + wy, base_z + wz))
        win = bpy.context.active_object
        win.scale = (0.6, 0.08, 0.5)
        win.name = f"{station['name']}_Window_{i}"
        win.data.materials.append(glow_mat)
        col.objects.link(win)
        bpy.context.scene.collection.objects.unlink(win)

    # Rotate entire collection toward spawn
    for obj in col.objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = walls
    bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
    bpy.context.scene.cursor.location = (px, py, base_z)
    for obj in col.objects:
        obj.rotation_euler.z = angle
    bpy.ops.object.select_all(action='DESELECT')

def create_character():
    col = bpy.data.collections.new("Character")
    bpy.context.scene.collection.children.link(col)
    skin = make_material("Skin", (1, 0.86, 0.67), roughness=0.8)
    tunic = make_material("Tunic", (0.36, 0.31, 0.81), roughness=0.7)
    pants = make_material("Pants", (0.24, 0.21, 0.4), roughness=0.8)
    boots = make_material("Boots", (0.36, 0.23, 0.12), roughness=0.9)
    hair = make_material("Hair", (0.16, 0.1, 0.04), roughness=0.9)
    cape_m = make_material("Cape", (0.72, 0.63, 0.96), roughness=0.6)

    def add_part(prim, name, mat, loc, scale=None, parent_col=col):
        prim()
        obj = bpy.context.active_object
        obj.name = name
        obj.location = loc
        if scale:
            obj.scale = scale
        obj.data.materials.append(mat)
        parent_col.objects.link(obj)
        bpy.context.scene.collection.objects.unlink(obj)
        return obj

    # Head
    add_part(lambda: bpy.ops.mesh.primitive_uv_sphere_add(radius=0.3, segments=12, ring_count=8),
             "Head", skin, (0, 0, 1.6))
    # Torso
    add_part(lambda: bpy.ops.mesh.primitive_cylinder_add(radius=0.28, depth=0.8),
             "Torso", tunic, (0, 0, 1.1))
    # Arms
    add_part(lambda: bpy.ops.mesh.primitive_cylinder_add(radius=0.09, depth=0.6),
             "LeftArm", tunic, (-0.4, 0, 1.15))
    add_part(lambda: bpy.ops.mesh.primitive_cylinder_add(radius=0.09, depth=0.6),
             "RightArm", tunic, (0.4, 0, 1.15))
    # Legs
    add_part(lambda: bpy.ops.mesh.primitive_cylinder_add(radius=0.11, depth=0.6),
             "LeftLeg", pants, (-0.14, 0, 0.5))
    add_part(lambda: bpy.ops.mesh.primitive_cylinder_add(radius=0.11, depth=0.6),
             "RightLeg", pants, (0.14, 0, 0.5))
    # Boots
    add_part(lambda: bpy.ops.mesh.primitive_cube_add(size=1),
             "LeftBoot", boots, (-0.14, 0.05, 0.12), scale=(0.2, 0.3, 0.22))
    add_part(lambda: bpy.ops.mesh.primitive_cube_add(size=1),
             "RightBoot", boots, (0.14, 0.05, 0.12), scale=(0.2, 0.3, 0.22))
    # Hair spikes
    for i in range(7):
        a = (i / 7) * math.pi * 2
        add_part(lambda: bpy.ops.mesh.primitive_cone_add(radius1=0.1, depth=0.3, vertices=4),
                 f"Hair_{i}", hair,
                 (math.cos(a) * 0.22, math.sin(a) * 0.18, 1.82))
    # Cape
    add_part(lambda: bpy.ops.mesh.primitive_plane_add(size=1),
             "Cape", cape_m, (0, -0.3, 1.1), scale=(0.55, 0.8, 1))

def create_trees():
    col = bpy.data.collections.new("Trees")
    bpy.context.scene.collection.children.link(col)
    trunk_mat = make_material("Trunk", (0.48, 0.32, 0.19), roughness=0.9)
    green_mat = make_material("GreenLeaf", (0.18, 0.55, 0.23), roughness=0.85)
    pink_mat = make_material("PinkLeaf", (1, 0.72, 0.77), roughness=0.75)

    for i in range(70):
        a = i * 2.399963
        r = 5 + (i * 0.55) % 28
        x, y = math.cos(a) * r, math.sin(a) * r
        if math.sqrt(x*x + y*y) >= ISLAND_RADIUS - 3:
            continue
        if any(math.hypot(x - s["pos"][0], y - s["pos"][1]) < 8 for s in STATIONS):
            continue
        if math.hypot(x - SPAWN[0], y - SPAWN[1]) < 5:
            continue
        is_pink = i % 5 == 0
        sc = 0.7 + math.sin(i * 3.7) * 0.35 if not is_pink else 0.6 + math.sin(i * 5.1) * 0.3
        tz = terrain_height(x, y)

        bpy.ops.mesh.primitive_cylinder_add(radius=0.17 * sc, depth=2.5 * sc, location=(x, y, tz + 1.25 * sc))
        trunk = bpy.context.active_object
        trunk.name = f"Trunk_{i}"
        trunk.data.materials.append(trunk_mat)
        col.objects.link(trunk)
        bpy.context.scene.collection.objects.unlink(trunk)

        if is_pink:
            bpy.ops.mesh.primitive_uv_sphere_add(radius=1.1 * sc, location=(x, y, tz + 3 * sc))
            leaf = bpy.context.active_object
            leaf.data.materials.append(pink_mat)
        else:
            bpy.ops.mesh.primitive_cone_add(radius1=1.3 * sc, depth=3 * sc, location=(x, y, tz + 3.2 * sc))
            leaf = bpy.context.active_object
            leaf.data.materials.append(green_mat)
        leaf.name = f"Leaf_{i}"
        col.objects.link(leaf)
        bpy.context.scene.collection.objects.unlink(leaf)

def export_glb():
    script_dir = os.path.dirname(os.path.abspath(__file__)) if "__file__" in dir() else os.getcwd()
    project_root = os.path.dirname(script_dir) if os.path.basename(script_dir) == "scripts" else script_dir
    out_dir = os.path.join(project_root, "public", "models")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "world.glb")
    bpy.ops.export_scene.gltf(
        filepath=out_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True,
    )
    print(f"Exported to: {out_path}")

# ---- Run ----
clear_scene()
print("Creating terrain...")
create_terrain()
print("Creating buildings...")
for s in STATIONS:
    create_building(s)
print("Creating character...")
create_character()
print("Creating trees...")
create_trees()
print("Exporting...")
export_glb()
print("Done! Open the .glb in Three.js with GLTFLoader.")
