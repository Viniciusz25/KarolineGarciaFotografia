"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LogOut, Upload, Trash2, Image as ImageIcon, Loader2, FolderPlus, Layers, Heart, Settings, Edit3, Grid, Eye, EyeOff, GripVertical } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type Category = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string | null;
  theme: "dark" | "light";
  cover_url: string | null;
  is_hidden?: boolean;
  order_index?: number;
  created_at: string;
  cover_position?: string | null;
};

function SortableItem({ id, children, className }: { id: string, children: (dragHandleProps: any) => React.ReactNode, className?: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 10 : 1 };
  return (
    <div ref={setNodeRef} style={style} className={className}>
      {children({ ...attributes, ...listeners })}
    </div>
  );
}

type Album = {
  id: string;
  title: string;
  category: string;
  subcategory?: string | null;
  cover_url: string;
  created_at: string;
  cover_position?: string | null;
};

type Photo = {
  id: string;
  url: string;
  category: string;
  title: string | null;
  album_id: string | null;
  created_at: string;
};

type SiteSetting = {
  key: string;
  title: string;
  section: string;
  url: string;
  cover_position?: string | null;
};

function DragPositioner({ 
  imageUrl, 
  value = "50% 50%", 
  onChange,
  aspectRatio = "aspect-[4/3]"
}: { 
  imageUrl: string; 
  value?: string; 
  onChange: (val: string) => void;
  aspectRatio?: string;
}) {
  const pos = value.split(' ');
  let initX = parseFloat(pos[0]);
  let initY = parseFloat(pos[1]);

  if (isNaN(initX)) initX = 50;
  if (isNaN(initY)) initY = 50;
  
  if (value === "center") { initX = 50; initY = 50; }
  else if (value === "top") { initX = 50; initY = 0; }
  else if (value === "bottom") { initX = 50; initY = 100; }
  else if (value === "left") { initX = 0; initY = 50; }
  else if (value === "right") { initX = 100; initY = 50; }

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startObjX = initX;
    const startObjY = initY;
    const sensitivity = 0.4; // % per pixel

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newX = startObjX - deltaX * sensitivity;
      let newY = startObjY - deltaY * sensitivity;

      newX = Math.max(0, Math.min(100, newX));
      newY = Math.max(0, Math.min(100, newY));

      onChange(`${Math.round(newX)}% ${Math.round(newY)}%`);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  if (!imageUrl) {
    return <div className={`w-full ${aspectRatio} bg-[#e8e2dd] flex items-center justify-center text-[10px] text-[#2d2422]/40 uppercase tracking-widest rounded`}>Adicione uma imagem primeiro</div>;
  }

  return (
    <div className="flex flex-col gap-2">
       <div 
         className={`relative w-full ${aspectRatio} bg-[#2d2422]/5 rounded overflow-hidden border border-[#2d2422]/10 cursor-grab active:cursor-grabbing group`}
         onPointerDown={handlePointerDown}
       >
          <img 
            src={imageUrl} 
            className="w-full h-full object-cover pointer-events-none select-none" 
            style={{ objectPosition: `${initX}% ${initY}%` }}
            draggable={false}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
             <span className="bg-black/60 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded backdrop-blur-sm">Arraste para ajustar</span>
          </div>
       </div>
       <div className="text-[9px] text-center text-[#2d2422]/50 tracking-widest uppercase">Posição atual: {Math.round(initX)}% {Math.round(initY)}%</div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"photos" | "albums" | "categories" | "settings">("photos");
  const [loading, setLoading] = useState(true);

  // Data States
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  
  // Upload States for Photos
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoCategory, setPhotoCategory] = useState<string>("");
  const [photoTitle, setPhotoTitle] = useState("");
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<{current: number, total: number} | null>(null);
  
  // Selection State for Bulk Delete
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  // Upload States for Albums
  const [uploadingAlbum, setUploadingAlbum] = useState(false);
  const [albumFile, setAlbumFile] = useState<File | null>(null);
  const [albumCategory, setAlbumCategory] = useState<string>("");
  const [albumSubcategory, setAlbumSubcategory] = useState<string>("");
  const [albumTitle, setAlbumTitle] = useState("");

  // Upload States for Categories
  const [uploadingCategory, setUploadingCategory] = useState(false);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catTheme, setCatTheme] = useState<"dark" | "light">("dark");
  const [catDesc, setCatDesc] = useState("");
  const [catParentId, setCatParentId] = useState<string>("");
  const [catFile, setCatFile] = useState<File | null>(null);
  const [catIsHidden, setCatIsHidden] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [catCoverPosition, setCatCoverPosition] = useState("center");
  const [editingAlbumPosition, setEditingAlbumPosition] = useState<Album | null>(null);
  const [editingSettingPosition, setEditingSettingPosition] = useState<SiteSetting | null>(null);

  // Upload States for Settings
  const [uploadingSettingKey, setUploadingSettingKey] = useState<string | null>(null);

  useEffect(() => {
    // Generate slug automatically based on category name only if not editing
    if (!editingCategoryId) {
      setCatSlug(catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  }, [catName, editingCategoryId]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push("/admin/login");
      } else {
        fetchData();
      }
    };
    checkUser();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: pData } = await supabase.from("photos").select("*").order("created_at", { ascending: false });
      if (pData) setPhotos(pData);

      const { data: aData } = await supabase.from("albums").select("*").order("created_at", { ascending: false });
      if (aData) setAlbums(aData);
      
      const { data: cData } = await supabase.from("categories").select("*").order("order_index", { ascending: true }).order("created_at", { ascending: true });
      if (cData) {
        setCategories(cData);
        // Default selects if possible
        const roots = cData.filter(c => !c.parent_id);
        if (roots.length > 0 && !photoCategory) setPhotoCategory(roots[0].slug);
        if (roots.length > 0 && !albumCategory) setAlbumCategory(roots[0].slug);
      }

      const { data: sData } = await supabase.from("site_settings").select("*");
      if (sData) setSettings(sData);
    } catch (err) {
      console.error("Unexpected error in fetchData:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // -----------------------------------------------------
  // UPLOAD DE SETTING (PERSONALIZAÇÃO)
  // -----------------------------------------------------
  const handleUploadSetting = async (key: string, file: File) => {
    try {
      setUploadingSettingKey(key);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("fotos").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("fotos").getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("site_settings").update({ url: publicUrl }).eq("key", key);
      if (dbError) throw dbError;

      setSettings(settings.map(s => s.key === key ? { ...s, url: publicUrl } : s));
      alert("Imagem atualizada com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar imagem.");
    } finally {
      setUploadingSettingKey(null);
    }
  };

  const handleSaveTextSetting = async (key: string, value: string, title: string, section: string) => {
    try {
      setUploadingSettingKey(key);
      // Verifica se existe
      const existing = settings.find(s => s.key === key);
      if (existing) {
        await supabase.from("site_settings").update({ url: value }).eq("key", key);
      } else {
        await supabase.from("site_settings").insert({ key, url: value, title, section });
      }
      const { data } = await supabase.from("site_settings").select("*");
      if (data) setSettings(data);
      alert("Configuração salva com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar configuração.");
    } finally {
      setUploadingSettingKey(null);
    }
  };

  // -----------------------------------------------------
  // GERENCIAMENTO DE CATEGORIAS
  // -----------------------------------------------------
  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName || !catSlug) return;
    
    setUploadingCategory(true);
    try {
        let finalCoverUrl = undefined;
        if (catFile) {
            const fileExt = catFile.name.split('.').pop();
            const fileName = `cat-${Date.now()}.${fileExt}`;
            const filePath = `categorias/${fileName}`;

            const { error: uploadError } = await supabase.storage.from("fotos").upload(filePath, catFile);
            if (uploadError) throw uploadError;
            
            const { data: { publicUrl } } = supabase.storage.from("fotos").getPublicUrl(filePath);
            finalCoverUrl = publicUrl;
        }

        const payload = {
            name: catName,
            slug: catSlug,
            parent_id: catParentId || null,
            theme: catParentId ? null : catTheme,
            description: catParentId ? null : catDesc,
            is_hidden: catIsHidden,
            cover_position: catCoverPosition
        };

        if (finalCoverUrl !== undefined) {
            (payload as any).cover_url = finalCoverUrl;
        }

        if (editingCategoryId) {
            const { error: dbError } = await supabase.from("categories").update(payload).eq("id", editingCategoryId);
            if (dbError) throw dbError;
            alert("Categoria atualizada com sucesso!");
        } else {
            const { error: dbError } = await supabase.from("categories").insert([payload]);
            if (dbError) throw dbError;
            alert("Categoria criada com sucesso!");
        }
        
        cancelEditCategory();
        fetchData();
    } catch (err: any) {
        alert("Erro ao salvar categoria: " + err.message);
    } finally {
        setUploadingCategory(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setCatName(category.name);
    setCatSlug(category.slug);
    setCatParentId(category.parent_id || "");
    setCatTheme(category.theme);
    setCatDesc(category.description || "");
    setCatIsHidden(!!category.is_hidden);
    setCatCoverPosition(category.cover_position || "center");
    setCatFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditCategory = () => {
    setEditingCategoryId(null);
    setCatName("");
    setCatSlug("");
    setCatParentId("");
    setCatTheme("dark");
    setCatDesc("");
    setCatIsHidden(false);
    setCatCoverPosition("center");
    setCatFile(null);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("ATENÇÃO: Excluir esta categoria pode quebrar álbuns vinculados a ela se você não excluí-los primeiro. Continuar?")) return;
    try {
      await supabase.from("categories").delete().eq("id", id);
      fetchData();
    } catch (err: any) {
      alert("Erro ao excluir: " + err.message);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEndRoots = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const rootCats = categories.filter(c => !c.parent_id);
      const oldIndex = rootCats.findIndex((c) => c.id === active.id);
      const newIndex = rootCats.findIndex((c) => c.id === over.id);
      const newRoots = arrayMove(rootCats, oldIndex, newIndex);
      
      const newCats = [...categories];
      newRoots.forEach((root, index) => {
          const idx = newCats.findIndex(c => c.id === root.id);
          if (idx !== -1) newCats[idx] = { ...root, order_index: index };
      });
      setCategories(newCats);
      
      for (let i = 0; i < newRoots.length; i++) {
        await supabase.from("categories").update({ order_index: i }).eq("id", newRoots[i].id);
      }
    }
  };

  const handleDragEndChildren = async (event: DragEndEvent, parentId: string) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const children = categories.filter(c => c.parent_id === parentId);
      const oldIndex = children.findIndex((c) => c.id === active.id);
      const newIndex = children.findIndex((c) => c.id === over.id);
      const newChildrenArray = arrayMove(children, oldIndex, newIndex);
      
      const newCats = [...categories];
      newChildrenArray.forEach((child, index) => {
          const idx = newCats.findIndex(c => c.id === child.id);
          if (idx !== -1) newCats[idx] = { ...child, order_index: index };
      });
      setCategories(newCats);
      
      for (let i = 0; i < newChildrenArray.length; i++) {
        await supabase.from("categories").update({ order_index: i }).eq("id", newChildrenArray[i].id);
      }
    }
  };

  const handleToggleCategoryVisibility = async (id: string, currentHidden: boolean) => {
    try {
      const { error } = await supabase.from("categories").update({ is_hidden: !currentHidden }).eq("id", id);
      if (error) throw error;
      fetchData();
    } catch (err: any) {
      alert("Erro ao alterar visibilidade: " + err.message);
    }
  };

  // -----------------------------------------------------
  // UPLOAD DE ÁLBUM
  // -----------------------------------------------------
  const handleUploadAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumFile || !albumTitle) return;

    setUploadingAlbum(true);
    try {
      const fileExt = albumFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `capas/${albumCategory}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("fotos").upload(filePath, albumFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("fotos").getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("albums").insert([
        { 
          title: albumTitle, 
          category: albumCategory, 
          cover_url: publicUrl,
          subcategory: albumSubcategory 
        }
      ]);
      if (dbError) throw dbError;

      alert("Ensaio criado com sucesso!");
      setAlbumFile(null);
      setAlbumTitle("");
      fetchData();
    } catch (error: any) {
      alert("Erro ao criar ensaio: " + error.message);
    } finally {
      setUploadingAlbum(false);
    }
  };

  // -----------------------------------------------------
  // UPLOAD DE FOTOS
  // -----------------------------------------------------
  const handleUploadPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (photoFiles.length === 0) return;

    setUploadingPhoto(true);
    try {
      let targetCategory = photoCategory;
      if (selectedAlbumId !== "") {
        const album = albums.find(a => a.id === selectedAlbumId);
        if (album) targetCategory = album.category;
      }

      let successCount = 0;
      setUploadProgress({ current: 0, total: photoFiles.length });

      for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${targetCategory}/${fileName}`;

        const { error: uploadError } = await supabase.storage.from("fotos").upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from("fotos").getPublicUrl(filePath);

        const { error: dbError } = await supabase.from("photos").insert([
          { 
            url: publicUrl, 
            category: targetCategory, 
            title: photoTitle || null,
            album_id: selectedAlbumId === "" ? null : selectedAlbumId 
          }
        ]);
        if (dbError) throw dbError;

        successCount++;
        setUploadProgress({ current: successCount, total: photoFiles.length });
      }

      setPhotoFiles([]);
      setPhotoTitle("");
      alert(`${successCount} foto(s) enviada(s) com sucesso!`);
      fetchData();
    } catch (error: any) {
      alert("Erro ao enviar foto(s): " + error.message);
    } finally {
      setUploadingPhoto(false);
      setUploadProgress(null);
    }
  };

  // -----------------------------------------------------
  // EXCLUSÃO DE FOTO / ÁLBUM
  // -----------------------------------------------------
  const handleDeletePhoto = async (photo: Photo) => {
    if (!window.confirm("Excluir esta foto?")) return;
    try {
      await supabase.from("photos").delete().eq("id", photo.id);
      const urlParts = photo.url.split("/fotos/");
      if (urlParts.length > 1) {
        await supabase.storage.from("fotos").remove([urlParts[1]]);
      }
      setPhotos(photos.filter(p => p.id !== photo.id));
      setSelectedPhotos(prev => prev.filter(id => id !== photo.id));
    } catch (error: any) {
      alert("Erro ao excluir: " + error.message);
    }
  };

  const handleBulkDeletePhotos = async () => {
    if (!window.confirm(`Excluir as ${selectedPhotos.length} fotos selecionadas?`)) return;
    try {
      setLoading(true);
      const photosToDelete = photos.filter(p => selectedPhotos.includes(p.id));
      await supabase.from("photos").delete().in("id", selectedPhotos);
      const pathsToDelete = photosToDelete.map(p => p.url.split("/fotos/")[1]).filter(path => !!path);
      
      if (pathsToDelete.length > 0) {
        await supabase.storage.from("fotos").remove(pathsToDelete);
      }
      setPhotos(photos.filter(p => !selectedPhotos.includes(p.id)));
      setSelectedPhotos([]);
    } catch (error: any) {
      alert("Erro ao excluir fotos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectPhoto = (id: string) => {
    setSelectedPhotos(prev => prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]);
  };

  const handleDeleteAlbum = async (album: Album) => {
    if (!window.confirm("Excluir ESTE ENSAIO e TODAS as fotos dentro dele? Essa ação não pode ser desfeita.")) return;
    try {
      await supabase.from("albums").delete().eq("id", album.id);
      const urlParts = album.cover_url.split("/fotos/");
      if (urlParts.length > 1) {
        await supabase.storage.from("fotos").remove([urlParts[1]]);
      }
      fetchData();
    } catch (error: any) {
      alert("Erro ao excluir ensaio: " + error.message);
    }
  };

  const handleUpdateAlbumPosition = async (id: string, position: string) => {
    try {
      const { error } = await supabase.from("albums").update({ cover_position: position }).eq("id", id);
      if (error) throw error;
      setAlbums(albums.map(a => a.id === id ? { ...a, cover_position: position } : a));
    } catch (err: any) {
      alert("Erro ao atualizar posição da capa: " + err.message);
    }
  };

  const handleUpdateSettingPosition = async (key: string, position: string) => {
    try {
      const { error } = await supabase.from("site_settings").update({ cover_position: position }).eq("key", key);
      if (error) throw error;
      setSettings(settings.map(s => s.key === key ? { ...s, cover_position: position } : s));
    } catch (err: any) {
      alert("Erro ao atualizar posição: " + err.message);
    }
  };

  const groupedSettings = settings.reduce((acc, curr) => {
    if (!acc[curr.section]) acc[curr.section] = [];
    acc[curr.section].push(curr);
    return acc;
  }, {} as Record<string, SiteSetting[]>);

  const rootCategories = categories.filter(c => !c.parent_id);
  const childCategories = categories.filter(c => c.parent_id);

  // Derivar as subcategorias pro form de album baseado na categoria selecionada
  const availableSubcategoriesForAlbum = categories.filter(c => c.parent_id === categories.find(root => root.slug === albumCategory)?.id);

  return (
    <div className="min-h-screen bg-[#f4ede8] font-sans flex flex-col pb-24">
      {/* HEADER ESCURO */}
      <header className="bg-[#120f0e] border-b border-[#cba37b]/20 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-[#cba37b]/30 rounded-full flex items-center justify-center text-[#cba37b] font-serif text-xl rotate-[-10deg]">
            KG
          </div>
          <div>
            <h1 className="font-serif text-xl text-[#f4ede8]">Painel de Controle</h1>
            <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] mt-1">Administração</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center text-[10px] uppercase tracking-widest font-medium text-white/70 hover:text-white border border-white/10 hover:bg-white/5 px-6 py-2.5 rounded transition-colors"
        >
          <LogOut className="w-3 h-3 mr-2" /> SAIR
        </button>
      </header>

      {/* Tabs Escuras */}
      <div className="bg-[#1a1715] border-b border-[#cba37b]/10 sticky top-[73px] z-40 shadow-xl shadow-black/5 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex space-x-8 min-w-max">
          <button
            onClick={() => setActiveTab("photos")}
            className={clsx(
              "py-4 font-medium transition-colors border-b-2 flex items-center text-[10px] uppercase tracking-widest whitespace-nowrap",
              activeTab === "photos" ? "border-[#cba37b] text-[#cba37b]" : "border-transparent text-white/40 hover:text-white/80"
            )}
          >
            <ImageIcon className="w-4 h-4 mr-2" /> Fotos Soltas & Galeria
          </button>
          <button
            onClick={() => setActiveTab("albums")}
            className={clsx(
              "py-4 font-medium transition-colors border-b-2 flex items-center text-[10px] uppercase tracking-widest whitespace-nowrap",
              activeTab === "albums" ? "border-[#cba37b] text-[#cba37b]" : "border-transparent text-white/40 hover:text-white/80"
            )}
          >
            <Layers className="w-4 h-4 mr-2" /> Gerenciar Ensaios (Álbuns)
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={clsx(
              "py-4 font-medium transition-colors border-b-2 flex items-center text-[10px] uppercase tracking-widest whitespace-nowrap",
              activeTab === "categories" ? "border-[#cba37b] text-[#cba37b]" : "border-transparent text-white/40 hover:text-white/80"
            )}
          >
            <Grid className="w-4 h-4 mr-2" /> Categorias
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={clsx(
              "py-4 font-medium transition-colors border-b-2 flex items-center text-[10px] uppercase tracking-widest whitespace-nowrap",
              activeTab === "settings" ? "border-[#cba37b] text-[#cba37b]" : "border-transparent text-white/40 hover:text-white/80"
            )}
          >
            <Settings className="w-4 h-4 mr-2" /> Personalização Antiga
          </button>
        </div>
      </div>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 text-[#2d2422]">
        
        {/* ============================================================================================== */}
        {/* TAB: CATEGORIES */}
        {/* ============================================================================================== */}
        {activeTab === "categories" && (
          <>
            <section className="lg:col-span-1">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-[#2d2422]/10 sticky top-40">
                <h2 className="font-serif text-2xl mb-6 flex items-center text-[#2d2422]">
                  <Grid className="w-5 h-5 mr-3 text-[#cba37b]" /> {editingCategoryId ? "Editar Categoria" : "Adicionar Categoria"}
                </h2>
                
                <form onSubmit={handleSubmitCategory} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Nome</label>
                    <input 
                      type="text" 
                      required
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      placeholder="Ex: Corporativo"
                      className="w-full px-4 py-3 bg-[#f4ede8] border border-[#2d2422]/10 rounded focus:bg-white focus:border-[#cba37b] outline-none text-sm placeholder:text-[#2d2422]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Slug (URL)</label>
                    <input 
                      type="text" 
                      value={catSlug}
                      onChange={(e) => editingCategoryId && setCatSlug(e.target.value)}
                      readOnly={!editingCategoryId}
                      className={clsx(
                        "w-full px-4 py-3 border border-[#2d2422]/10 rounded outline-none text-sm",
                        editingCategoryId ? "bg-[#f4ede8] focus:bg-white focus:border-[#cba37b]" : "bg-[#e8e2dd] text-[#2d2422]/50"
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Categoria Pai (Deixe vazio para Principal)</label>
                    <select 
                      value={catParentId}
                      onChange={(e) => setCatParentId(e.target.value)}
                      className="w-full px-4 py-3 bg-[#f4ede8] border border-[#2d2422]/10 rounded focus:bg-white focus:border-[#cba37b] outline-none text-sm"
                    >
                      <option value="">-- Nenhuma (É uma categoria principal) --</option>
                      {rootCategories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {catParentId === "" && (
                    <>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Tema da Seção</label>
                        <select 
                          value={catTheme}
                          onChange={(e) => setCatTheme(e.target.value as "dark"|"light")}
                          className="w-full px-4 py-3 bg-[#f4ede8] border border-[#2d2422]/10 rounded focus:bg-white focus:border-[#cba37b] outline-none text-sm"
                        >
                          <option value="dark">Escuro (Dark)</option>
                          <option value="light">Claro (Light)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Descrição (Subtítulo)</label>
                        <textarea 
                          value={catDesc}
                          onChange={(e) => setCatDesc(e.target.value)}
                          placeholder="Texto curto para a home..."
                          className="w-full px-4 py-3 bg-[#f4ede8] border border-[#2d2422]/10 rounded focus:bg-white focus:border-[#cba37b] outline-none text-sm h-24 resize-none placeholder:text-[#2d2422]/30"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Imagem de Capa {catParentId === "" ? "(Fundo Hero)" : "(Mosaico)"}</label>
                    <div className="border border-dashed border-[#2d2422]/20 rounded p-6 text-center hover:bg-[#f2eee9] transition-colors cursor-pointer relative bg-[#f4ede8]/50">
                      <input 
                        type="file" 
                        accept="image/*" 
                        required={false}
                        onChange={(e) => setCatFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {catFile ? (
                        <div className="text-[#cba37b] font-medium text-sm truncate px-2">{catFile.name}</div>
                      ) : (
                        <div className="text-[#2d2422]/50 text-sm flex flex-col items-center">
                          <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
                          Clique para anexar a imagem
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Posição da Capa</label>
                      <p className="text-[9px] text-[#2d2422]/40 mb-2">Clique e arraste a própria imagem para deixá-la no enquadramento perfeito.</p>
                      <DragPositioner 
                        imageUrl={catFile ? URL.createObjectURL(catFile) : (categories.find(c => c.id === editingCategoryId)?.cover_url || "")}
                        value={catCoverPosition}
                        onChange={setCatCoverPosition}
                        aspectRatio="aspect-video"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="catIsHidden"
                      checked={catIsHidden}
                      onChange={(e) => setCatIsHidden(e.target.checked)}
                      className="accent-[#cba37b] w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="catIsHidden" className="text-sm text-[#2d2422] cursor-pointer">
                      Ocultar categoria no site
                    </label>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="submit"
                      disabled={uploadingCategory || !catName || !catSlug}
                      className="flex-1 bg-[#0f0c0b] text-white py-4 rounded font-medium uppercase tracking-widest text-[10px] hover:bg-[#cba37b] hover:text-[#0f0c0b] transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      {uploadingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingCategoryId ? "SALVAR ALTERAÇÕES" : "CRIAR CATEGORIA")}
                    </button>
                    {editingCategoryId && (
                      <button
                        type="button"
                        onClick={cancelEditCategory}
                        className="bg-transparent border border-[#2d2422]/20 text-[#2d2422] py-4 px-6 rounded font-medium uppercase tracking-widest text-[10px] hover:bg-[#2d2422]/5 transition-colors"
                      >
                        CANCELAR
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </section>

            <section className="lg:col-span-2 space-y-8">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-[#2d2422]/10">
                <h2 className="font-serif text-2xl mb-8 text-[#2d2422]">Estrutura de Categorias</h2>
                
                {loading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#cba37b]" />
                  </div>
                ) : rootCategories.length === 0 ? (
                  <div className="text-center py-20 text-[#2d2422]/40">
                    Nenhuma categoria encontrada.
                  </div>
                ) : (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndRoots}>
                    <SortableContext items={rootCategories.map(r => r.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-6">
                        {rootCategories.map((root) => (
                          <SortableItem key={root.id} id={root.id} className="border border-[#2d2422]/10 rounded-xl overflow-hidden bg-white">
                            {(dragHandleProps) => (
                              <>
                                <div className="bg-[#f4ede8] p-4 flex justify-between items-center relative">
                                  <div className="flex items-center gap-4">
                                    <div className="cursor-grab text-[#2d2422]/20 hover:text-[#cba37b]" {...dragHandleProps}>
                                      <GripVertical className="w-5 h-5"/>
                                    </div>
                                    {root.cover_url && <img src={root.cover_url} className="w-12 h-12 object-cover rounded shadow-sm" />}
                                    <div>
                                      <h3 className="font-serif text-xl">{root.name}</h3>
                                      <div className="flex gap-2 mt-1">
                                        <span className="bg-[#cba37b]/20 text-[#cba37b] text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-medium">Root</span>
                                        <span className="bg-black/5 text-black/60 text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-medium">Tema: {root.theme}</span>
                                        {root.is_hidden && <span className="bg-red-500/10 text-red-600 text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-medium">Oculta</span>}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-1 relative z-20">
                                    <button onClick={() => handleToggleCategoryVisibility(root.id, !!root.is_hidden)} className="text-[#2d2422]/40 hover:text-[#cba37b] p-2 transition-colors" title={root.is_hidden ? "Mostrar" : "Ocultar"}>
                                      {root.is_hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <button onClick={() => handleEditCategory(root)} className="text-[#2d2422]/40 hover:text-[#cba37b] p-2 transition-colors" title="Editar">
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDeleteCategory(root.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-4 h-4" /></button>
                                  </div>
                                </div>
                                
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEndChildren(e, root.id)}>
                                  <SortableContext items={childCategories.filter(c => c.parent_id === root.id).map(c => c.id)} strategy={rectSortingStrategy}>
                                    <div className="p-4 bg-white grid grid-cols-2 md:grid-cols-3 gap-4">
                                      {childCategories.filter(c => c.parent_id === root.id).map(child => (
                                        <SortableItem key={child.id} id={child.id} className="relative group rounded border border-[#2d2422]/10 p-3 flex items-center gap-3 bg-white">
                                          {(childDragHandleProps) => (
                                            <>
                                              <div className="cursor-grab text-[#2d2422]/20 hover:text-[#cba37b] shrink-0" {...childDragHandleProps}>
                                                <GripVertical className="w-4 h-4"/>
                                              </div>
                                              {child.cover_url ? (
                                                <img src={child.cover_url} className="w-10 h-10 object-cover rounded shrink-0" />
                                              ) : (
                                                <div className="w-10 h-10 bg-[#f4ede8] flex items-center justify-center rounded shrink-0 text-[#cba37b]/50"><ImageIcon className="w-4 h-4" /></div>
                                              )}
                                              <div className="min-w-0 flex-1">
                                                <p className="font-medium text-sm text-[#2d2422] truncate">{child.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                  <p className="text-[9px] text-[#2d2422]/50 truncate">{child.slug}</p>
                                                  {child.is_hidden && <span className="bg-red-500/10 text-red-600 text-[9px] uppercase tracking-widest px-1.5 rounded font-medium">Oculta</span>}
                                                </div>
                                              </div>
                                              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white pl-2 z-20">
                                                <button onClick={() => handleToggleCategoryVisibility(child.id, !!child.is_hidden)} className="text-[#2d2422]/40 hover:text-[#cba37b] p-1.5 transition-colors">
                                                  {child.is_hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                                <button onClick={() => handleEditCategory(child)} className="text-[#2d2422]/40 hover:text-[#cba37b] p-1.5 transition-colors" title="Editar">
                                                  <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDeleteCategory(child.id)} className="text-red-500 hover:text-red-700 p-1.5"><Trash2 className="w-4 h-4" /></button>
                                              </div>
                                            </>
                                          )}
                                        </SortableItem>
                                      ))}
                                      {childCategories.filter(c => c.parent_id === root.id).length === 0 && (
                                        <p className="col-span-full text-xs text-[#2d2422]/40 italic">Sem subcategorias.</p>
                                      )}
                                    </div>
                                  </SortableContext>
                                </DndContext>
                              </>
                            )}
                          </SortableItem>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </section>
          </>
        )}

        {/* ============================================================================================== */}
        {/* TAB: SETTINGS */}
        {/* ============================================================================================== */}
        {activeTab === "settings" && (
          <section className="col-span-1 lg:col-span-3">
            <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg border border-[#2d2422]/10 min-h-[500px]">
              
              {/* NOVA SEÇÃO: Configurações Dinâmicas da Home */}
              <div className="mb-16 pb-12 border-b border-[#2d2422]/10">
                <div className="max-w-3xl mb-8">
                  <h2 className="font-serif text-3xl mb-2 text-[#2d2422]">Configurações da Home</h2>
                  <p className="text-[#2d2422]/60 text-sm">Escolha quais categorias aparecerão em cada seção da página inicial.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-[#f4ede8]/30 p-6 rounded-xl border border-[#2d2422]/5">
                    <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/80 mb-3">
                      Galeria Mosaico 1 (Home)
                    </label>
                    <p className="text-xs text-[#2d2422]/50 mb-4">Escolha o ensaio cujas fotos (máx. 6) aparecerão na primeira galeria mosaico.</p>
                    <div className="flex gap-4 items-center">
                      <select 
                        value={settings.find(s => s.key === "home_masonry_album")?.url || ""}
                        onChange={(e) => handleSaveTextSetting("home_masonry_album", e.target.value, "Ensaio Mosaico 1 da Home", "Home Dinâmica")}
                        disabled={uploadingSettingKey === "home_masonry_album"}
                        className="flex-1 px-4 py-3 bg-white border border-[#2d2422]/10 rounded focus:border-[#cba37b] outline-none text-sm"
                      >
                        <option value="">Selecione um ensaio...</option>
                        {albums.map(a => (
                          <option key={a.id} value={a.id}>[{a.category.toUpperCase()}] {a.title}</option>
                        ))}
                      </select>
                      {uploadingSettingKey === "home_masonry_album" && <Loader2 className="w-5 h-5 animate-spin text-[#cba37b]" />}
                    </div>
                  </div>

                  <div className="bg-[#f4ede8]/30 p-6 rounded-xl border border-[#2d2422]/5">
                    <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/80 mb-3">
                      Galeria Mosaico 2 (Home)
                    </label>
                    <p className="text-xs text-[#2d2422]/50 mb-4">Escolha o ensaio cujas fotos (máx. 6) aparecerão na segunda galeria mosaico.</p>
                    <div className="flex gap-4 items-center">
                      <select 
                        value={settings.find(s => s.key === "home_masonry_album_2")?.url || ""}
                        onChange={(e) => handleSaveTextSetting("home_masonry_album_2", e.target.value, "Ensaio Mosaico 2 da Home", "Home Dinâmica")}
                        disabled={uploadingSettingKey === "home_masonry_album_2"}
                        className="flex-1 px-4 py-3 bg-white border border-[#2d2422]/10 rounded focus:border-[#cba37b] outline-none text-sm"
                      >
                        <option value="">Selecione um ensaio...</option>
                        {albums.map(a => (
                          <option key={a.id} value={a.id}>[{a.category.toUpperCase()}] {a.title}</option>
                        ))}
                      </select>
                      {uploadingSettingKey === "home_masonry_album_2" && <Loader2 className="w-5 h-5 animate-spin text-[#cba37b]" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Configurações Dinâmicas da Página Sobre */}
              <div className="mb-16 pb-12 border-b border-[#2d2422]/10">
                <div className="max-w-3xl mb-8">
                  <h2 className="font-serif text-3xl mb-2 text-[#2d2422]">Configurações da Página Sobre</h2>
                  <p className="text-[#2d2422]/60 text-sm">Escolha o ensaio dos pets que aparecerá na galeria no final da página.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-[#f4ede8]/30 p-6 rounded-xl border border-[#2d2422]/5">
                    <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/80 mb-3">
                      Galeria dos Pets (Sobre)
                    </label>
                    <p className="text-xs text-[#2d2422]/50 mb-4">Escolha o ensaio cujas fotos aparecerão na tira da página sobre.</p>
                    <div className="flex gap-4 items-center">
                      <select 
                        value={settings.find(s => s.key === "sobre_pets_album")?.url || ""}
                        onChange={(e) => handleSaveTextSetting("sobre_pets_album", e.target.value, "Ensaio Pets da Página Sobre", "Sobre Dinâmica")}
                        disabled={uploadingSettingKey === "sobre_pets_album"}
                        className="flex-1 px-4 py-3 bg-white border border-[#2d2422]/10 rounded focus:border-[#cba37b] outline-none text-sm"
                      >
                        <option value="">Selecione um ensaio...</option>
                        {albums.map(a => (
                          <option key={a.id} value={a.id}>[{a.category.toUpperCase()}] {a.title}</option>
                        ))}
                      </select>
                      {uploadingSettingKey === "sobre_pets_album" && <Loader2 className="w-5 h-5 animate-spin text-[#cba37b]" />}
                    </div>
                  </div>
                </div>
              </div>
              <div className="max-w-3xl mb-10">
                <h2 className="font-serif text-3xl mb-2 text-[#2d2422]">Personalização Antiga (Legado)</h2>
                <p className="text-[#2d2422]/60 text-sm">Estas imagens eram usadas antes do gerenciador de categorias dinâmicas. Você ainda pode alterá-las, mas elas podem não aparecer mais no site novo.</p>
              </div>

              {loading ? (
                <div className="flex justify-center py-32">
                  <Loader2 className="w-8 h-8 animate-spin text-[#cba37b]" />
                </div>
              ) : Object.keys(groupedSettings).length === 0 ? (
                <div className="text-center py-20 text-[#2d2422]/40">
                  Nenhuma configuração encontrada no banco de dados.
                </div>
              ) : (
                <div className="space-y-12">
                  {Object.entries(groupedSettings).map(([section, sectionSettings]) => (
                    <div key={section}>
                      <h3 className="text-xl font-serif text-[#2d2422] mb-6 border-b border-[#2d2422]/10 pb-2">{section}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {sectionSettings.map(setting => (
                          <div key={setting.key} className="relative group flex flex-col">
                            <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2 truncate" title={setting.title}>
                              {setting.title}
                            </label>
                            
                            <div className="relative aspect-square md:aspect-[4/5] rounded-xl overflow-hidden bg-muted cursor-pointer shadow-sm border border-[#2d2422]/10 group-hover:border-[#cba37b] transition-all">
                              <img src={setting.url} alt={setting.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" style={{ objectPosition: setting.cover_position || 'center' }} />
                              
                              <button 
                                onClick={(e) => { e.preventDefault(); setEditingSettingPosition(setting); }}
                                className="absolute top-2 left-2 bg-black/60 hover:bg-black/80 text-white px-2 py-1 rounded backdrop-blur-sm border border-white/10 text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all z-20"
                              >
                                Ajustar Capa
                              </button>

                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                                {uploadingSettingKey === setting.key ? (
                                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                                ) : (
                                  <div className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full">
                                    <Edit3 className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              
                              <input 
                                type="file" 
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={uploadingSettingKey === setting.key}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleUploadSetting(setting.key, e.target.files[0]);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ============================================================================================== */}
        {/* TAB: PHOTOS */}
        {/* ============================================================================================== */}
        {activeTab === "photos" && (
          <>
            <section className="lg:col-span-1">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-[#2d2422]/10 sticky top-40">
                <h2 className="font-serif text-2xl mb-6 flex items-center text-[#2d2422]">
                  <Upload className="w-5 h-5 mr-3 text-[#cba37b]" /> Upload de Foto
                </h2>
                
                <form onSubmit={handleUploadPhoto} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Imagens (Envio em Massa)</label>
                    <div className="border border-dashed border-[#2d2422]/20 rounded p-6 text-center hover:bg-[#f2eee9] transition-colors cursor-pointer relative bg-[#f4ede8]/50">
                      <input 
                        type="file" 
                        accept="image/*" 
                        required
                        multiple
                        onChange={(e) => setPhotoFiles(Array.from(e.target.files || []))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {photoFiles.length > 0 ? (
                        <div className="text-[#cba37b] font-medium text-sm px-2">
                          {photoFiles.length} foto(s) selecionada(s)
                          <div className="text-[10px] text-[#2d2422]/50 font-normal truncate mt-1">
                            {photoFiles.map(f => f.name).join(", ")}
                          </div>
                        </div>
                      ) : (
                        <div className="text-[#2d2422]/50 text-sm flex flex-col items-center">
                          <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
                          Clique para selecionar as fotos
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Vincular a qual Ensaio?</label>
                    <select 
                      value={selectedAlbumId}
                      onChange={(e) => setSelectedAlbumId(e.target.value)}
                      className="w-full px-4 py-3 bg-[#f4ede8] border border-[#2d2422]/10 rounded focus:bg-white focus:border-[#cba37b] outline-none text-sm"
                    >
                      <option value="">Sem vínculo (Fotos Soltas no Portfólio)</option>
                      {albums.map(a => (
                        <option key={a.id} value={a.id}>[{a.category.toUpperCase()}] {a.title}</option>
                      ))}
                    </select>
                  </div>

                  {selectedAlbumId === "" && (
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Categoria (para Fotos Soltas)</label>
                      <select 
                        value={photoCategory}
                        onChange={(e) => setPhotoCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-[#f4ede8] border border-[#2d2422]/10 rounded focus:bg-white focus:border-[#cba37b] outline-none text-sm"
                      >
                        {rootCategories.map(c => (
                          <option key={c.id} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Título (Opcional - será aplicado a todas)</label>
                    <input 
                      type="text" 
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      placeholder="Ex: Praia (Deixe vazio se preferir)"
                      className="w-full px-4 py-3 bg-[#f4ede8] border border-[#2d2422]/10 rounded focus:bg-white focus:border-[#cba37b] outline-none text-sm placeholder:text-[#2d2422]/30"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={uploadingPhoto || photoFiles.length === 0}
                    className="w-full bg-[#0f0c0b] text-white py-4 rounded font-medium uppercase tracking-widest text-[10px] hover:bg-[#cba37b] hover:text-[#0f0c0b] transition-colors flex items-center justify-center disabled:opacity-50 mt-6"
                  >
                    {uploadingPhoto ? (
                      <span className="flex items-center">
                        <Loader2 className="w-4 h-4 animate-spin mr-2" /> 
                        Enviando {uploadProgress?.current} de {uploadProgress?.total}...
                      </span>
                    ) : "FAZER UPLOAD"}
                  </button>
                </form>
              </div>
            </section>

            <section className="lg:col-span-2">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-[#2d2422]/10 min-h-[500px]">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-serif text-2xl text-[#2d2422]">Todas as Fotos</h2>
                  
                  {photos.length > 0 && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedPhotos(selectedPhotos.length === photos.length ? [] : photos.map(p => p.id))}
                        className="text-[10px] font-medium uppercase tracking-widest text-[#2d2422]/60 hover:text-[#2d2422] border border-[#2d2422]/20 px-4 py-2 rounded transition-colors"
                      >
                        {selectedPhotos.length === photos.length ? "Desmarcar Tudo" : "Selecionar Tudo"}
                      </button>
                      
                      {selectedPhotos.length > 0 && (
                        <button 
                          onClick={handleBulkDeletePhotos}
                          className="text-[10px] font-medium uppercase tracking-widest bg-red-900/10 hover:bg-red-500 text-red-600 hover:text-white px-4 py-2 rounded transition-colors flex items-center shadow-sm"
                        >
                          <Trash2 className="w-3 h-3 mr-2" /> Excluir {selectedPhotos.length}
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {loading ? (
                  <div className="flex justify-center py-32">
                    <Loader2 className="w-8 h-8 animate-spin text-[#cba37b]" />
                  </div>
                ) : photos.length === 0 ? (
                  <div className="text-center py-32 text-[#2d2422]/40">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    Nenhuma foto publicada ainda.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photos.map((photo) => {
                      const isSelected = selectedPhotos.includes(photo.id);
                      return (
                        <motion.div 
                          key={photo.id} 
                          layout 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className={clsx(
                            "group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer border-2 transition-all duration-300",
                            isSelected ? "border-[#cba37b] scale-95" : "border-transparent"
                          )}
                          onClick={() => toggleSelectPhoto(photo.id)}
                        >
                          <img src={photo.url} className="w-full h-full object-cover" />
                          
                          <div className={clsx(
                            "absolute top-3 left-3 w-5 h-5 rounded flex items-center justify-center transition-colors z-20 shadow-sm",
                            isSelected ? "bg-[#cba37b] border-transparent" : "border border-white/50 bg-black/20"
                          )}>
                            {isSelected && <div className="w-2 h-2 bg-white rounded-sm" />}
                          </div>

                          <div className={clsx(
                            "absolute inset-0 transition-opacity flex flex-col justify-end p-4",
                            isSelected ? "bg-black/30 opacity-100" : "bg-black/60 opacity-0 group-hover:opacity-100"
                          )}>
                            <div className="flex justify-between items-end">
                              <div>
                                <span className="bg-[#cba37b] text-[#120f0e] text-[9px] uppercase tracking-widest px-2 py-1 rounded font-medium">
                                  {photo.album_id ? 'ENSAIO' : 'SOLTA'}
                                </span>
                                {photo.album_id && (
                                  <p className="text-white/80 text-[9px] uppercase tracking-widest mt-2 truncate">Vínculo: Sim</p>
                                )}
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePhoto(photo);
                                }} 
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-colors shadow-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* ============================================================================================== */}
        {/* TAB: ALBUMS */}
        {/* ============================================================================================== */}
        {activeTab === "albums" && (
          <>
            <section className="lg:col-span-1">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-[#2d2422]/10 sticky top-40">
                <h2 className="font-serif text-2xl mb-6 flex items-center text-[#2d2422]">
                  <FolderPlus className="w-5 h-5 mr-3 text-[#cba37b]" /> Criar Novo Ensaio
                </h2>
                
                <form onSubmit={handleUploadAlbum} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Título do Ensaio</label>
                    <input 
                      type="text" 
                      required
                      value={albumTitle}
                      onChange={(e) => setAlbumTitle(e.target.value)}
                      placeholder="Ex: Casamento João e Maria"
                      className="w-full px-4 py-3 bg-[#f4ede8] border border-[#2d2422]/10 rounded focus:bg-white focus:border-[#cba37b] outline-none text-sm placeholder:text-[#2d2422]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Categoria</label>
                    <select 
                      value={albumCategory}
                      onChange={(e) => {
                        setAlbumCategory(e.target.value);
                        setAlbumSubcategory("");
                      }}
                      className="w-full px-4 py-3 bg-[#f4ede8] border border-[#2d2422]/10 rounded focus:bg-white focus:border-[#cba37b] outline-none text-sm"
                    >
                      {rootCategories.map(c => (
                        <option key={c.id} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {availableSubcategoriesForAlbum.length > 0 && (
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Subcategoria</label>
                      <select 
                        value={albumSubcategory}
                        onChange={(e) => setAlbumSubcategory(e.target.value)}
                        className="w-full px-4 py-3 bg-[#f4ede8] border border-[#2d2422]/10 rounded focus:bg-white focus:border-[#cba37b] outline-none text-sm"
                      >
                        <option value="">Selecione...</option>
                        {availableSubcategoriesForAlbum.map(sub => (
                          <option key={sub.id} value={sub.slug}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Foto de Capa</label>
                    <div className="border border-dashed border-[#2d2422]/20 rounded p-6 text-center hover:bg-[#f2eee9] transition-colors cursor-pointer relative bg-[#f4ede8]/50">
                      <input 
                        type="file" 
                        accept="image/*" 
                        required
                        onChange={(e) => setAlbumFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {albumFile ? (
                        <div className="text-[#cba37b] font-medium text-sm truncate px-2">{albumFile.name}</div>
                      ) : (
                        <div className="text-[#2d2422]/50 text-sm flex flex-col items-center">
                          <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
                          Clique para anexar a capa
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={uploadingAlbum || !albumFile || !albumTitle}
                    className="w-full bg-[#0f0c0b] text-white py-4 rounded font-medium uppercase tracking-widest text-[10px] hover:bg-[#cba37b] hover:text-[#0f0c0b] transition-colors flex items-center justify-center disabled:opacity-50 mt-6"
                  >
                    {uploadingAlbum ? <Loader2 className="w-4 h-4 animate-spin" /> : "CRIAR ENSAIO"}
                  </button>
                </form>
              </div>
            </section>

            <section className="lg:col-span-2">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-[#2d2422]/10 min-h-[500px]">
                <h2 className="font-serif text-2xl mb-8 text-[#2d2422]">Ensaios Publicados</h2>
                
                {loading ? (
                  <div className="flex justify-center py-32">
                    <Loader2 className="w-8 h-8 animate-spin text-[#cba37b]" />
                  </div>
                ) : albums.length === 0 ? (
                  <div className="text-center py-32 text-[#2d2422]/40">
                    <FolderPlus className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    Nenhum ensaio criado ainda.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {albums.map((album) => (
                      <motion.div key={album.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-muted shadow-sm border border-black/5">
                        <img src={album.cover_url} className="w-full h-full object-cover" style={{ objectPosition: album.cover_position || 'center' }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                          <span className="bg-[#cba37b] text-[#120f0e] text-[9px] uppercase tracking-widest px-2 py-1 rounded font-medium w-max mb-2">
                            {album.category} {album.subcategory ? `- ${album.subcategory}` : ''}
                          </span>
                          <h3 className="text-white font-serif text-2xl">{album.title}</h3>
                          
                          <button 
                            onClick={() => setEditingAlbumPosition(album)}
                            className="absolute top-4 left-4 bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded backdrop-blur-sm border border-white/10 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all flex items-center shadow-lg"
                          >
                            Ajustar Capa
                          </button>

                          <button 
                            onClick={() => handleDeleteAlbum(album)}
                            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            title="Excluir Ensaio Inteiro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}

      </main>

      {mounted && typeof document !== "undefined" && createPortal(
        <>
          <AnimatePresence>
            {editingSettingPosition && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              >
                <motion.div 
                  initial={{ scale: 0.95 }} 
                  animate={{ scale: 1 }} 
                  exit={{ scale: 0.95 }}
                  className="bg-[#f4ede8] rounded-xl p-6 md:p-8 max-w-md w-full border border-[#2d2422]/10 shadow-2xl"
                >
                  <h3 className="font-serif text-2xl text-[#2d2422] mb-2">Ajustar Capa</h3>
                  <p className="text-[#2d2422]/60 text-xs mb-6">Clique e arraste a imagem abaixo para ajustar o enquadramento.</p>
                  
                  <div className="bg-white p-2 rounded-lg shadow-inner">
                    <DragPositioner 
                      imageUrl={editingSettingPosition.url}
                      value={editingSettingPosition.cover_position || "50% 50%"}
                      onChange={(val) => setEditingSettingPosition({...editingSettingPosition, cover_position: val})}
                      aspectRatio="aspect-video"
                    />
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button 
                      onClick={async () => {
                        await handleUpdateSettingPosition(editingSettingPosition.key, editingSettingPosition.cover_position || "50% 50%");
                        setEditingSettingPosition(null);
                      }}
                      className="flex-1 bg-[#0f0c0b] text-white py-3.5 rounded text-[10px] uppercase tracking-widest font-medium hover:bg-[#cba37b] hover:text-[#0f0c0b] transition-colors"
                    >
                      Salvar Posição
                    </button>
                    <button 
                      onClick={() => setEditingSettingPosition(null)}
                      className="flex-1 border border-[#2d2422]/20 text-[#2d2422] py-3.5 rounded text-[10px] uppercase tracking-widest font-medium hover:bg-[#2d2422]/5 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {editingAlbumPosition && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              >
                <motion.div 
                  initial={{ scale: 0.95 }} 
                  animate={{ scale: 1 }} 
                  exit={{ scale: 0.95 }}
                  className="bg-[#f4ede8] rounded-xl p-6 md:p-8 max-w-md w-full border border-[#2d2422]/10 shadow-2xl"
                >
                  <h3 className="font-serif text-2xl text-[#2d2422] mb-2">Ajustar Capa</h3>
                  <p className="text-[#2d2422]/60 text-xs mb-6">Clique e arraste a imagem abaixo para ajustar o enquadramento perfeito. Assim ela aparecerá no site.</p>
                  
                  <div className="bg-white p-2 rounded-lg shadow-inner">
                    <DragPositioner 
                      imageUrl={editingAlbumPosition.cover_url}
                      value={editingAlbumPosition.cover_position || "50% 50%"}
                      onChange={(val) => setEditingAlbumPosition({...editingAlbumPosition, cover_position: val})}
                      aspectRatio="aspect-[4/3]"
                    />
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button 
                      onClick={async () => {
                        await handleUpdateAlbumPosition(editingAlbumPosition.id, editingAlbumPosition.cover_position || "50% 50%");
                        setEditingAlbumPosition(null);
                      }}
                      className="flex-1 bg-[#0f0c0b] text-white py-3.5 rounded text-[10px] uppercase tracking-widest font-medium hover:bg-[#cba37b] hover:text-[#0f0c0b] transition-colors"
                    >
                      Salvar Posição
                    </button>
                    <button 
                      onClick={() => setEditingAlbumPosition(null)}
                      className="flex-1 border border-[#2d2422]/20 text-[#2d2422] py-3.5 rounded text-[10px] uppercase tracking-widest font-medium hover:bg-[#2d2422]/5 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </div>
  );
}
