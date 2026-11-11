"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
  FolderPlus,
  Layers,
  Settings,
  Edit3,
  Grid,
  Eye,
  EyeOff,
  GripVertical,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Plus,
  FolderOpen,
  ArrowLeft,
  Search,
  Filter,
  Move,
  X,
  Sparkles,
  Camera,
  Film,
  Play,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

type ToastMessage = {
  id: number;
  type: "success" | "error";
  text: string;
};

// Descrições amigáveis para cada espaço de foto fixo do site
const SETTING_HELPERS: Record<string, { label: string; hint: string; aspect: string }> = {
  home_escolha_social: {
    label: "Capa Social (Topo da Home - Lado Esquerdo)",
    hint: "Aparece na divisão inicial da Home representando Fotografia Social.",
    aspect: "aspect-[3/4]",
  },
  home_escolha_pet: {
    label: "Capa Pet (Topo da Home - Lado Direito)",
    hint: "Aparece na divisão inicial da Home representando Fotografia Pet.",
    aspect: "aspect-[3/4]",
  },
  home_sobre_mosaic_1: {
    label: "Foto Principal — Seção 'Fotografar É' (Home)",
    hint: "Foto maior com bordas arredondadas na seção Sobre da página inicial.",
    aspect: "aspect-[4/5]",
  },
  home_sobre_mosaic_2: {
    label: "Polaroid 1 — Seção 'Fotografar É' (Home)",
    hint: "Primeira foto estilo Polaroid sobreposta na Home.",
    aspect: "aspect-[3/4]",
  },
  home_sobre_mosaic_3: {
    label: "Polaroid 2 — Seção 'Fotografar É' (Home)",
    hint: "Segunda foto estilo Polaroid com a frase 'fotografar é sentir ♥'.",
    aspect: "aspect-[3/4]",
  },
  home_hero_bg: {
    label: "Fundo do Banner 'Vamos contar a sua história?' (Home)",
    hint: "Imagem de fundo escura no banner de orçamento da página inicial.",
    aspect: "aspect-video",
  },
  sobre_image_3: {
    label: "Retrato da Karoline — Topo da Página Sobre",
    hint: "Sua foto principal ao lado do texto 'Minha História' (com o selo KG).",
    aspect: "aspect-[3/4]",
  },
  sobre_image_1: {
    label: "Foto Decorativa — Seção 'Meus Valores' (Sobre)",
    hint: "Foto horizontal inclinada exibida ao lado dos 4 pilares de valores.",
    aspect: "aspect-video",
  },
  sobre_hero_bg: {
    label: "Textura Suave de Fundo — Seção 'Meus Valores' (Sobre)",
    hint: "Imagem de fundo em marca d'água bem suave na seção de valores.",
    aspect: "aspect-video",
  },
  contato_hero_bg: {
    label: "Foto do Topo — Página de Contato",
    hint: "Imagem exibida no lado esquerdo do cabeçalho escuro da página Contato.",
    aspect: "aspect-[4/3]",
  },
  contato_studio: {
    label: "Miniatura do Rodapé — Página de Contato",
    hint: "Pequena foto ao lado da chamada 'Pronta para começar?' no final da página Contato.",
    aspect: "aspect-video",
  },
};

const ALBUM_LINK_SETTING_KEYS = new Set([
  "home_masonry_album",
  "home_masonry_album_2",
  "sobre_pets_album",
]);

function SortableItem({
  id,
  children,
  className,
}: {
  id: string;
  children: (dragHandleProps: any) => React.ReactNode;
  className?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className={className}>
      {children({ ...attributes, ...listeners })}
    </div>
  );
}

function DragPositioner({
  imageUrl,
  value = "50% 50%",
  onChange,
  aspectRatio = "aspect-[4/3]",
}: {
  imageUrl: string;
  value?: string;
  onChange: (val: string) => void;
  aspectRatio?: string;
}) {
  const pos = value.split(" ");
  let initX = parseFloat(pos[0]);
  let initY = parseFloat(pos[1]);

  if (isNaN(initX)) initX = 50;
  if (isNaN(initY)) initY = 50;

  if (value === "center") {
    initX = 50;
    initY = 50;
  } else if (value === "top") {
    initX = 50;
    initY = 0;
  } else if (value === "bottom") {
    initX = 50;
    initY = 100;
  } else if (value === "left") {
    initX = 0;
    initY = 50;
  } else if (value === "right") {
    initX = 100;
    initY = 50;
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startObjX = initX;
    const startObjY = initY;
    const sensitivity = 0.4;

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
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  if (!imageUrl) {
    return (
      <div
        className={`w-full ${aspectRatio} bg-[#e8e2dd] flex items-center justify-center text-[11px] text-[#2d2422]/40 uppercase tracking-widest rounded-lg`}
      >
        Selecione uma imagem para ajustar o enquadramento
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div
        className={`relative w-full ${aspectRatio} bg-[#2d2422]/5 rounded-lg overflow-hidden border border-[#2d2422]/15 cursor-grab active:cursor-grabbing group`}
        onPointerDown={handlePointerDown}
      >
        <img
          src={imageUrl}
          alt="Prévia de enquadramento"
          className="w-full h-full object-cover pointer-events-none select-none"
          style={{ objectPosition: `${initX}% ${initY}%` }}
          draggable={false}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/15 opacity-90 group-hover:opacity-100 transition-opacity">
          <span className="bg-black/70 text-white text-[10px] uppercase tracking-widest font-medium px-3.5 py-2 rounded-full backdrop-blur-sm flex items-center gap-2 shadow">
            <Move className="w-3.5 h-3.5 text-[#cba37b]" /> Arraste a foto para ajustar o foco
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between text-[10px] text-[#2d2422]/60 px-1">
        <span>Foco atual: {Math.round(initX)}% horizontal · {Math.round(initY)}% vertical</span>
        <button
          type="button"
          onClick={() => onChange("50% 50%")}
          className="text-[#cba37b] hover:underline font-medium cursor-pointer"
        >
          Centralizar (50% 50%)
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "albums" | "photos" | "categories" | "settings"
  >("albums");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const showToast = (text: string, type: "success" | "error" = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Data States
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSetting[]>([]);

  // Active Album Detail View (inside "albums" tab)
  const [openedAlbumId, setOpenedAlbumId] = useState<string | null>(null);
  const openedAlbum = useMemo(
    () => albums.find((a) => a.id === openedAlbumId) || null,
    [albums, openedAlbumId]
  );

  // Album Filter & Search
  const [albumSearch, setAlbumSearch] = useState("");
  const [albumCategoryFilter, setAlbumCategoryFilter] = useState<string>("all");

  // Photo Filter in "photos" tab
  const [photoFilter, setPhotoFilter] = useState<string>("all"); // "all" | "loose" | albumId
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  // Upload States for Photos
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoCategory, setPhotoCategory] = useState<string>("");
  const [photoTitle, setPhotoTitle] = useState("");
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);

  // Upload / Edit States for Albums
  const [uploadingAlbum, setUploadingAlbum] = useState(false);
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [albumFile, setAlbumFile] = useState<File | null>(null);
  const [albumCoverFromExistingUrl, setAlbumCoverFromExistingUrl] = useState<string>("");
  const [albumVideoFile, setAlbumVideoFile] = useState<File | null>(null);
  const [albumVideoUrlInput, setAlbumVideoUrlInput] = useState<string>("");
  const [uploadingAlbumVideo, setUploadingAlbumVideo] = useState(false);
  const [albumCategory, setAlbumCategory] = useState<string>("");
  const [albumSubcategory, setAlbumSubcategory] = useState<string>("");
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumCoverPosition, setAlbumCoverPosition] = useState("50% 50%");

  // Upload / Edit States for Categories
  const [uploadingCategory, setUploadingCategory] = useState(false);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catTheme, setCatTheme] = useState<"dark" | "light">("light");
  const [catDesc, setCatDesc] = useState("");
  const [catParentId, setCatParentId] = useState<string>("");
  const [catFile, setCatFile] = useState<File | null>(null);
  const [catIsHidden, setCatIsHidden] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catCoverPosition, setCatCoverPosition] = useState("50% 50%");

  // Modals for Position Adjustment
  const [editingAlbumPosition, setEditingAlbumPosition] = useState<Album | null>(null);
  const [editingSettingPosition, setEditingSettingPosition] =
    useState<SiteSetting | null>(null);

  // Upload States for Settings
  const [uploadingSettingKey, setUploadingSettingKey] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!editingCategoryId) {
      setCatSlug(
        catName
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  }, [catName, editingCategoryId]);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
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
      const [pRes, aRes, cRes, sRes] = await Promise.all([
        supabase.from("photos").select("*").order("created_at", { ascending: false }),
        supabase.from("albums").select("*").order("created_at", { ascending: false }),
        supabase
          .from("categories")
          .select("*")
          .order("order_index", { ascending: true })
          .order("created_at", { ascending: true }),
        supabase.from("site_settings").select("*"),
      ]);

      if (pRes.data) setPhotos(pRes.data);
      if (aRes.data) setAlbums(aRes.data);
      if (cRes.data) {
        setCategories(cRes.data);
        const roots = cRes.data.filter((c) => !c.parent_id);
        if (roots.length > 0 && !photoCategory) setPhotoCategory(roots[0].slug);
        if (roots.length > 0 && !albumCategory) setAlbumCategory(roots[0].slug);
      }
      if (sRes.data) setSettings(sRes.data);
    } catch (err) {
      console.error("Unexpected error in fetchData:", err);
      showToast("Erro ao carregar dados do painel.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // -----------------------------------------------------
  // UPLOAD DE SETTING (PERSONALIZAÇÃO DO SITE)
  // -----------------------------------------------------
  const handleUploadSetting = async (key: string, file: File) => {
    try {
      setUploadingSettingKey(key);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("fotos")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("fotos").getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from("site_settings")
        .update({ url: publicUrl })
        .eq("key", key);
      if (dbError) throw dbError;

      setSettings((prev) =>
        prev.map((s) => (s.key === key ? { ...s, url: publicUrl } : s))
      );
      showToast("Imagem do site atualizada com sucesso!");
    } catch (err: any) {
      console.error(err);
      showToast("Erro ao atualizar imagem: " + (err.message || ""), "error");
    } finally {
      setUploadingSettingKey(null);
    }
  };

  const handleSaveTextSetting = async (
    key: string,
    value: string,
    title: string,
    section: string
  ) => {
    try {
      setUploadingSettingKey(key);
      const existing = settings.find((s) => s.key === key);
      if (existing) {
        await supabase.from("site_settings").update({ url: value }).eq("key", key);
      } else {
        await supabase
          .from("site_settings")
          .insert({ key, url: value, title, section });
      }
      const { data } = await supabase.from("site_settings").select("*");
      if (data) setSettings(data);
      showToast("Configuração salva com sucesso!");
    } catch (err) {
      console.error(err);
      showToast("Erro ao salvar configuração.", "error");
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
      let finalCoverUrl: string | undefined = undefined;
      if (catFile) {
        const fileExt = catFile.name.split(".").pop();
        const fileName = `cat-${Date.now()}.${fileExt}`;
        const filePath = `categorias/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("fotos")
          .upload(filePath, catFile);
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("fotos").getPublicUrl(filePath);
        finalCoverUrl = publicUrl;
      }

      const payload: Record<string, any> = {
        name: catName,
        slug: catSlug,
        parent_id: catParentId || null,
        theme: catParentId ? null : catTheme,
        description: catParentId ? null : catDesc,
        is_hidden: catIsHidden,
        cover_position: catCoverPosition,
      };

      if (finalCoverUrl !== undefined) {
        payload.cover_url = finalCoverUrl;
      }

      if (editingCategoryId) {
        const { error: dbError } = await supabase
          .from("categories")
          .update(payload)
          .eq("id", editingCategoryId);
        if (dbError) throw dbError;
        showToast("Categoria atualizada com sucesso!");
      } else {
        const { error: dbError } = await supabase
          .from("categories")
          .insert([payload]);
        if (dbError) throw dbError;
        showToast("Nova categoria criada!");
      }

      cancelEditCategory();
      fetchData();
    } catch (err: any) {
      showToast("Erro ao salvar categoria: " + err.message, "error");
    } finally {
      setUploadingCategory(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setCatName(category.name);
    setCatSlug(category.slug);
    setCatParentId(category.parent_id || "");
    setCatTheme(category.theme || "light");
    setCatDesc(category.description || "");
    setCatIsHidden(!!category.is_hidden);
    setCatCoverPosition(category.cover_position || "50% 50%");
    setCatFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditCategory = () => {
    setEditingCategoryId(null);
    setCatName("");
    setCatSlug("");
    setCatParentId("");
    setCatTheme("light");
    setCatDesc("");
    setCatIsHidden(false);
    setCatCoverPosition("50% 50%");
    setCatFile(null);
  };

  const handleDeleteCategory = async (id: string) => {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir esta categoria? Verifique se não há ensaios vinculados a ela."
      )
    )
      return;
    try {
      await supabase.from("categories").delete().eq("id", id);
      showToast("Categoria removida.");
      fetchData();
    } catch (err: any) {
      showToast("Erro ao excluir: " + err.message, "error");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEndRoots = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const rootCats = categories.filter((c) => !c.parent_id);
      const oldIndex = rootCats.findIndex((c) => c.id === active.id);
      const newIndex = rootCats.findIndex((c) => c.id === over.id);
      const newRoots = arrayMove(rootCats, oldIndex, newIndex);

      const newCats = [...categories];
      newRoots.forEach((root, index) => {
        const idx = newCats.findIndex((c) => c.id === root.id);
        if (idx !== -1) newCats[idx] = { ...root, order_index: index };
      });
      setCategories(newCats);

      for (let i = 0; i < newRoots.length; i++) {
        await supabase
          .from("categories")
          .update({ order_index: i })
          .eq("id", newRoots[i].id);
      }
      showToast("Ordem das categorias salva!");
    }
  };

  const handleDragEndChildren = async (event: DragEndEvent, parentId: string) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const children = categories.filter((c) => c.parent_id === parentId);
      const oldIndex = children.findIndex((c) => c.id === active.id);
      const newIndex = children.findIndex((c) => c.id === over.id);
      const newChildrenArray = arrayMove(children, oldIndex, newIndex);

      const newCats = [...categories];
      newChildrenArray.forEach((child, index) => {
        const idx = newCats.findIndex((c) => c.id === child.id);
        if (idx !== -1) newCats[idx] = { ...child, order_index: index };
      });
      setCategories(newCats);

      for (let i = 0; i < newChildrenArray.length; i++) {
        await supabase
          .from("categories")
          .update({ order_index: i })
          .eq("id", newChildrenArray[i].id);
      }
      showToast("Ordem das subcategorias salva!");
    }
  };

  const handleToggleCategoryVisibility = async (
    id: string,
    currentHidden: boolean
  ) => {
    try {
      const { error } = await supabase
        .from("categories")
        .update({ is_hidden: !currentHidden })
        .eq("id", id);
      if (error) throw error;
      showToast(
        !currentHidden
          ? "Categoria ocultada no site."
          : "Categoria visível no site."
      );
      fetchData();
    } catch (err: any) {
      showToast("Erro ao alterar visibilidade: " + err.message, "error");
    }
  };

  // -----------------------------------------------------
  // CRIAR / EDITAR ENSAIO (ÁLBUM)
  // -----------------------------------------------------
  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumTitle) return;

    setUploadingAlbum(true);
    try {
      let publicCoverUrl: string | undefined = albumCoverFromExistingUrl || undefined;

      if (albumFile) {
        const fileExt = albumFile.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `capas/${albumCategory}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("fotos")
          .upload(filePath, albumFile);
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("fotos").getPublicUrl(filePath);
        publicCoverUrl = publicUrl;
      }

      let finalVideoUrl: string | undefined = undefined;
      if (albumVideoFile) {
        const vExt = albumVideoFile.name.split(".").pop();
        const vName = `video-${Math.random().toString(36).substring(2)}-${Date.now()}.${vExt}`;
        const vPath = `videos/${albumCategory}/${vName}`;

        const { error: vUpErr } = await supabase.storage
          .from("fotos")
          .upload(vPath, albumVideoFile);
        if (vUpErr) throw vUpErr;

        const {
          data: { publicUrl: vPubUrl },
        } = supabase.storage.from("fotos").getPublicUrl(vPath);
        finalVideoUrl = vPubUrl;
      } else if (albumVideoUrlInput.trim()) {
        finalVideoUrl = albumVideoUrlInput.trim();
      }

      if (editingAlbumId) {
        const updatePayload: Record<string, any> = {
          title: albumTitle,
          category: albumCategory,
          subcategory: albumSubcategory || null,
          cover_position: albumCoverPosition,
        };
        if (publicCoverUrl) updatePayload.cover_url = publicCoverUrl;

        const { error: dbError } = await supabase
          .from("albums")
          .update(updatePayload)
          .eq("id", editingAlbumId);
        if (dbError) throw dbError;

        if (finalVideoUrl !== undefined) {
          await upsertAlbumVideoSetting(editingAlbumId, albumTitle, finalVideoUrl);
        }

        showToast("Ensaio atualizado com sucesso!");
      } else {
        const { data: inserted, error: dbError } = await supabase
          .from("albums")
          .insert([
            {
              title: albumTitle,
              category: albumCategory,
              cover_url: publicCoverUrl || "",
              subcategory: albumSubcategory || null,
              cover_position: albumCoverPosition,
            },
          ])
          .select()
          .single();
        if (dbError) throw dbError;

        if (inserted && finalVideoUrl) {
          await upsertAlbumVideoSetting(inserted.id, albumTitle, finalVideoUrl);
        }

        showToast(
          publicCoverUrl
            ? "Ensaio criado! Agora você pode enviar as fotos dele."
            : "Ensaio criado! Envie as fotos e escolha qualquer uma delas como capa."
        );
        if (inserted) {
          setOpenedAlbumId(inserted.id);
          setSelectedAlbumId(inserted.id);
        }
      }

      cancelEditAlbum();
      fetchData();
    } catch (error: any) {
      showToast("Erro ao salvar ensaio: " + error.message, "error");
    } finally {
      setUploadingAlbum(false);
    }
  };

  const handleSetPhotoAsAlbumCover = async (albumId: string, photoUrl: string) => {
    try {
      const { error } = await supabase
        .from("albums")
        .update({ cover_url: photoUrl, cover_position: "50% 50%" })
        .eq("id", albumId);
      if (error) throw error;

      setAlbums((prev) =>
        prev.map((a) =>
          a.id === albumId
            ? { ...a, cover_url: photoUrl, cover_position: "50% 50%" }
            : a
        )
      );
      showToast("Foto definida como capa do ensaio!");
    } catch (err: any) {
      showToast("Erro ao definir capa: " + err.message, "error");
    }
  };

  const upsertAlbumVideoSetting = async (
    albumId: string,
    title: string,
    videoUrl: string
  ) => {
    const key = `album_video_${albumId}`;
    const existing = settings.find((s) => s.key === key);
    if (existing) {
      await supabase
        .from("site_settings")
        .update({ url: videoUrl, title: `Vídeo Resumo - ${title}` })
        .eq("key", key);
    } else {
      await supabase.from("site_settings").insert([
        {
          key,
          title: `Vídeo Resumo - ${title}`,
          section: "Vídeo Resumo do Ensaio",
          url: videoUrl,
        },
      ]);
    }
  };

  const handleSaveOpenedAlbumVideo = async (
    e: React.FormEvent,
    album: Album
  ) => {
    e.preventDefault();
    if (!albumVideoFile && !albumVideoUrlInput.trim()) return;

    setUploadingAlbumVideo(true);
    try {
      let finalVideoUrl = albumVideoUrlInput.trim();
      if (albumVideoFile) {
        const vExt = albumVideoFile.name.split(".").pop();
        const vName = `video-${Math.random().toString(36).substring(2)}-${Date.now()}.${vExt}`;
        const vPath = `videos/${album.category}/${vName}`;

        const { error: vUpErr } = await supabase.storage
          .from("fotos")
          .upload(vPath, albumVideoFile);
        if (vUpErr) throw vUpErr;

        const {
          data: { publicUrl },
        } = supabase.storage.from("fotos").getPublicUrl(vPath);
        finalVideoUrl = publicUrl;
      }

      await upsertAlbumVideoSetting(album.id, album.title, finalVideoUrl);
      setAlbumVideoFile(null);
      setAlbumVideoUrlInput("");
      const { data } = await supabase.from("site_settings").select("*");
      if (data) setSettings(data);
      showToast("Vídeo resumo adicionado ao ensaio com sucesso!");
    } catch (err: any) {
      showToast("Erro ao salvar vídeo resumo: " + err.message, "error");
    } finally {
      setUploadingAlbumVideo(false);
    }
  };

  const handleRemoveAlbumVideo = async (albumId: string) => {
    if (!window.confirm("Remover o vídeo resumo deste ensaio?")) return;
    try {
      const key = `album_video_${albumId}`;
      const existing = settings.find((s) => s.key === key);
      if (existing) {
        const urlParts = existing.url.split("/fotos/");
        if (urlParts.length > 1) {
          await supabase.storage.from("fotos").remove([urlParts[1]]);
        }
        await supabase.from("site_settings").delete().eq("key", key);
        setSettings((prev) => prev.filter((s) => s.key !== key));
      }
      showToast("Vídeo resumo removido do ensaio.");
    } catch (err: any) {
      showToast("Erro ao remover vídeo: " + err.message, "error");
    }
  };

  const startEditAlbum = (album: Album) => {
    setEditingAlbumId(album.id);
    setAlbumTitle(album.title);
    setAlbumCategory(album.category);
    setAlbumSubcategory(album.subcategory || "");
    setAlbumCoverPosition(album.cover_position || "50% 50%");
    setAlbumFile(null);
    setAlbumCoverFromExistingUrl("");
    setAlbumVideoFile(null);
    const existingVid =
      settings.find((s) => s.key === `album_video_${album.id}`)?.url || "";
    setAlbumVideoUrlInput(existingVid);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditAlbum = () => {
    setEditingAlbumId(null);
    setAlbumFile(null);
    setAlbumCoverFromExistingUrl("");
    setAlbumVideoFile(null);
    setAlbumVideoUrlInput("");
    setAlbumTitle("");
    setAlbumCoverPosition("50% 50%");
  };

  // -----------------------------------------------------
  // UPLOAD DE FOTOS (EM MASSA OU PARA ENSAIO)
  // -----------------------------------------------------
  const handleUploadPhoto = async (e: React.FormEvent, forcedAlbumId?: string) => {
    e.preventDefault();
    if (photoFiles.length === 0) return;

    const targetAlbumId =
      forcedAlbumId !== undefined ? forcedAlbumId : selectedAlbumId;

    setUploadingPhoto(true);
    try {
      let targetCategory = photoCategory;
      if (targetAlbumId !== "") {
        const album = albums.find((a) => a.id === targetAlbumId);
        if (album) targetCategory = album.category;
      }

      let successCount = 0;
      let firstUploadedUrl = "";
      setUploadProgress({ current: 0, total: photoFiles.length });

      for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${targetCategory}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("fotos")
          .upload(filePath, file);
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("fotos").getPublicUrl(filePath);

        if (!firstUploadedUrl) firstUploadedUrl = publicUrl;

        const { error: dbError } = await supabase.from("photos").insert([
          {
            url: publicUrl,
            category: targetCategory,
            title: photoTitle || null,
            album_id: targetAlbumId === "" ? null : targetAlbumId,
          },
        ]);
        if (dbError) throw dbError;

        successCount++;
        setUploadProgress({ current: successCount, total: photoFiles.length });
      }

      // Se o ensaio ainda não tinha foto de capa, usa automaticamente a primeira foto enviada
      if (targetAlbumId !== "" && firstUploadedUrl) {
        const targetAlbum = albums.find((a) => a.id === targetAlbumId);
        if (targetAlbum && !targetAlbum.cover_url) {
          await supabase
            .from("albums")
            .update({ cover_url: firstUploadedUrl })
            .eq("id", targetAlbumId);
        }
      }

      setPhotoFiles([]);
      setPhotoTitle("");
      showToast(`${successCount} foto(s) enviada(s) com sucesso!`);
      fetchData();
    } catch (error: any) {
      showToast("Erro ao enviar foto(s): " + error.message, "error");
    } finally {
      setUploadingPhoto(false);
      setUploadProgress(null);
    }
  };

  // -----------------------------------------------------
  // EXCLUSÃO DE FOTO / ÁLBUM
  // -----------------------------------------------------
  const handleDeletePhoto = async (photo: Photo) => {
    if (!window.confirm("Deseja realmente excluir esta foto?")) return;
    try {
      await supabase.from("photos").delete().eq("id", photo.id);
      const usedAsAlbumCover = albums.some((a) => a.cover_url === photo.url);
      const urlParts = photo.url.split("/fotos/");
      if (urlParts.length > 1 && !usedAsAlbumCover) {
        await supabase.storage.from("fotos").remove([urlParts[1]]);
      }
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      setSelectedPhotos((prev) => prev.filter((id) => id !== photo.id));
      showToast("Foto excluída.");
    } catch (error: any) {
      showToast("Erro ao excluir: " + error.message, "error");
    }
  };

  const handleBulkDeletePhotos = async () => {
    if (
      !window.confirm(
        `Excluir as ${selectedPhotos.length} fotos selecionadas? Esta ação não pode ser desfeita.`
      )
    )
      return;
    try {
      setLoading(true);
      const photosToDelete = photos.filter((p) => selectedPhotos.includes(p.id));
      await supabase.from("photos").delete().in("id", selectedPhotos);
      const albumCoverUrls = new Set(albums.map((a) => a.cover_url));
      const pathsToDelete = photosToDelete
        .filter((p) => !albumCoverUrls.has(p.url))
        .map((p) => p.url.split("/fotos/")[1])
        .filter((path) => !!path);

      if (pathsToDelete.length > 0) {
        await supabase.storage.from("fotos").remove(pathsToDelete);
      }
      const count = selectedPhotos.length;
      setPhotos((prev) => prev.filter((p) => !selectedPhotos.includes(p.id)));
      setSelectedPhotos([]);
      showToast(`${count} fotos excluídas com sucesso.`);
    } catch (error: any) {
      showToast("Erro ao excluir fotos: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectPhoto = (id: string) => {
    setSelectedPhotos((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleDeleteAlbum = async (album: Album) => {
    const albumPhotos = photos.filter((p) => p.album_id === album.id);
    if (
      !window.confirm(
        `Excluir o ensaio "${album.title}" e todas as ${albumPhotos.length} foto(s) dentro dele? Essa ação não pode ser desfeita.`
      )
    )
      return;
    try {
      // Remove photos of this album from storage & db
      if (albumPhotos.length > 0) {
        const photoPaths = albumPhotos
          .map((p) => p.url.split("/fotos/")[1])
          .filter(Boolean);
        if (photoPaths.length > 0) {
          await supabase.storage.from("fotos").remove(photoPaths);
        }
        await supabase.from("photos").delete().eq("album_id", album.id);
      }

      // Remove video summary of this album if any
      const videoKey = `album_video_${album.id}`;
      const videoSetting = settings.find((s) => s.key === videoKey);
      if (videoSetting) {
        const vParts = videoSetting.url.split("/fotos/");
        if (vParts.length > 1) {
          await supabase.storage.from("fotos").remove([vParts[1]]);
        }
        await supabase.from("site_settings").delete().eq("key", videoKey);
      }

      await supabase.from("albums").delete().eq("id", album.id);
      const urlParts = album.cover_url.split("/fotos/");
      if (urlParts.length > 1) {
        await supabase.storage.from("fotos").remove([urlParts[1]]);
      }
      if (openedAlbumId === album.id) setOpenedAlbumId(null);
      showToast(`Ensaio "${album.title}" excluído.`);
      fetchData();
    } catch (error: any) {
      showToast("Erro ao excluir ensaio: " + error.message, "error");
    }
  };

  const handleUpdateAlbumPosition = async (id: string, position: string) => {
    try {
      const { error } = await supabase
        .from("albums")
        .update({ cover_position: position })
        .eq("id", id);
      if (error) throw error;
      setAlbums((prev) =>
        prev.map((a) => (a.id === id ? { ...a, cover_position: position } : a))
      );
      showToast("Enquadramento da capa salvo!");
    } catch (err: any) {
      showToast("Erro ao atualizar posição da capa: " + err.message, "error");
    }
  };

  const handleUpdateSettingPosition = async (key: string, position: string) => {
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({ cover_position: position })
        .eq("key", key);
      if (error) throw error;
      setSettings((prev) =>
        prev.map((s) => (s.key === key ? { ...s, cover_position: position } : s))
      );
      showToast("Enquadramento salvo!");
    } catch (err: any) {
      showToast("Erro ao atualizar posição: " + err.message, "error");
    }
  };

  // Filtrar apenas configurações que são realmente imagens (excluindo chaves que guardam ID de álbum ou vídeo de ensaio)
  const imageSettings = useMemo(
    () =>
      settings.filter(
        (s) =>
          !ALBUM_LINK_SETTING_KEYS.has(s.key) &&
          !s.key.startsWith("album_video_")
      ),
    [settings]
  );

  // Mapa de albumId -> URL do Vídeo Resumo
  const albumVideoById = useMemo(() => {
    const map: Record<string, string> = {};
    settings.forEach((s) => {
      if (s.key.startsWith("album_video_") && s.url) {
        const aId = s.key.replace("album_video_", "");
        map[aId] = s.url;
      }
    });
    return map;
  }, [settings]);

  const groupedSettings = useMemo(() => {
    return imageSettings.reduce((acc, curr) => {
      const sec = curr.section || "Outras Imagens";
      if (!acc[sec]) acc[sec] = [];
      acc[sec].push(curr);
      return acc;
    }, {} as Record<string, SiteSetting[]>);
  }, [imageSettings]);

  const rootCategories = categories.filter((c) => !c.parent_id);
  const childCategories = categories.filter((c) => c.parent_id);

  const availableSubcategoriesForAlbum = categories.filter(
    (c) =>
      c.parent_id ===
      categories.find((root) => root.slug === albumCategory)?.id
  );

  // Contagem de fotos por álbum
  const photoCountByAlbum = useMemo(() => {
    const counts: Record<string, number> = {};
    photos.forEach((p) => {
      if (p.album_id) {
        counts[p.album_id] = (counts[p.album_id] || 0) + 1;
      }
    });
    return counts;
  }, [photos]);

  // Mapa de id -> título do álbum
  const albumTitleById = useMemo(() => {
    const map: Record<string, string> = {};
    albums.forEach((a) => {
      map[a.id] = a.title;
    });
    return map;
  }, [albums]);

  // Álbuns filtrados na aba de Ensaios
  const filteredAlbums = useMemo(() => {
    return albums.filter((a) => {
      const matchesCat =
        albumCategoryFilter === "all" || a.category === albumCategoryFilter;
      const matchesSearch =
        !albumSearch.trim() ||
        a.title.toLowerCase().includes(albumSearch.toLowerCase()) ||
        (a.subcategory || "").toLowerCase().includes(albumSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [albums, albumCategoryFilter, albumSearch]);

  // Fotos filtradas na aba de Fotos
  const filteredPhotos = useMemo(() => {
    if (photoFilter === "all") return photos;
    if (photoFilter === "loose") return photos.filter((p) => !p.album_id);
    return photos.filter((p) => p.album_id === photoFilter);
  }, [photos, photoFilter]);

  const loosePhotosCount = useMemo(
    () => photos.filter((p) => !p.album_id).length,
    [photos]
  );

  return (
    <div className="min-h-screen bg-[#f4ede8] font-sans flex flex-col pb-24 text-[#2d2422]">
      {/* TOAST NOTIFICATIONS */}
      <div className="fixed bottom-6 right-6 z-[120] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 md:px-0">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={clsx(
                "pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-xl border text-xs font-medium backdrop-blur-md",
                t.type === "success"
                  ? "bg-[#120f0e]/95 text-[#f4ede8] border-[#cba37b]/40"
                  : "bg-red-950/95 text-red-100 border-red-500/40"
              )}
            >
              {t.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-[#cba37b] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span className="flex-1 leading-relaxed">{t.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* TOP HEADER */}
      <header className="bg-[#120f0e] border-b border-[#cba37b]/20 py-4 px-6 md:px-12 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-[#cba37b]/40 rounded-full flex items-center justify-center text-[#cba37b] font-serif text-lg">
            KG
          </div>
          <div>
            <h1 className="font-serif text-lg md:text-xl text-[#f4ede8] leading-tight">
              Estúdio Karoline Garcia
            </h1>
            <p className="text-[10px] text-white/50 uppercase tracking-[0.2em]">
              Painel Administrativo
            </p>
          </div>
        </div>

        {/* Resumo Rápido + Ações */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden xl:flex items-center gap-6 mr-4 pr-6 border-r border-white/10 text-xs text-white/70">
            <div>
              <span className="text-[#cba37b] font-semibold">{albums.length}</span> ensaios
            </div>
            <div>
              <span className="text-[#cba37b] font-semibold">{photos.length}</span> fotos no total
            </div>
            <div>
              <span className="text-[#cba37b] font-semibold">{rootCategories.length}</span> categorias
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center text-[10px] uppercase tracking-widest font-medium text-[#cba37b] hover:text-white border border-[#cba37b]/30 hover:border-white/40 px-4 py-2.5 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 mr-2" /> Ver Site
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center text-[10px] uppercase tracking-widest font-medium text-white/70 hover:text-white border border-white/10 hover:bg-white/5 px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" /> Sair
          </button>
        </div>
      </header>

      {/* NAVIGATION TABS */}
      <div className="bg-[#1a1715] border-b border-[#cba37b]/10 sticky top-[73px] z-40 shadow-md overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex space-x-2 md:space-x-6 min-w-max">
          <button
            onClick={() => {
              setActiveTab("albums");
              setOpenedAlbumId(null);
            }}
            className={clsx(
              "py-4 px-3 font-medium transition-all border-b-2 flex items-center text-xs tracking-wide whitespace-nowrap cursor-pointer",
              activeTab === "albums"
                ? "border-[#cba37b] text-[#cba37b]"
                : "border-transparent text-white/50 hover:text-white/90"
            )}
          >
            <Layers className="w-4 h-4 mr-2.5" />
            1. Meus Ensaios (Álbuns)
            <span className="ml-2 bg-white/10 text-white/80 text-[10px] px-2 py-0.5 rounded-full">
              {albums.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("photos")}
            className={clsx(
              "py-4 px-3 font-medium transition-all border-b-2 flex items-center text-xs tracking-wide whitespace-nowrap cursor-pointer",
              activeTab === "photos"
                ? "border-[#cba37b] text-[#cba37b]"
                : "border-transparent text-white/50 hover:text-white/90"
            )}
          >
            <ImageIcon className="w-4 h-4 mr-2.5" />
            2. Galeria & Fotos Soltas
            <span className="ml-2 bg-white/10 text-white/80 text-[10px] px-2 py-0.5 rounded-full">
              {photos.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={clsx(
              "py-4 px-3 font-medium transition-all border-b-2 flex items-center text-xs tracking-wide whitespace-nowrap cursor-pointer",
              activeTab === "categories"
                ? "border-[#cba37b] text-[#cba37b]"
                : "border-transparent text-white/50 hover:text-white/90"
            )}
          >
            <Grid className="w-4 h-4 mr-2.5" />
            3. Categorias & Pastas
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={clsx(
              "py-4 px-3 font-medium transition-all border-b-2 flex items-center text-xs tracking-wide whitespace-nowrap cursor-pointer",
              activeTab === "settings"
                ? "border-[#cba37b] text-[#cba37b]"
                : "border-transparent text-white/50 hover:text-white/90"
            )}
          >
            <Settings className="w-4 h-4 mr-2.5" />
            4. Personalizar Site (Home, Sobre e Contato)
          </button>
        </div>
      </div>

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {/* ============================================================================================== */}
        {/* TAB 1: ENSAIOS (ÁLBUNS) & GESTÃO DIRETA DE FOTOS DO ENSAIO */}
        {/* ============================================================================================== */}
        {activeTab === "albums" && !openedAlbum && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna Esquerda: Criar ou Editar Ensaio */}
            <section className="lg:col-span-1">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#2d2422]/10 sticky top-36">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl flex items-center text-[#2d2422]">
                    <FolderPlus className="w-5 h-5 mr-3 text-[#cba37b]" />
                    {editingAlbumId ? "Editar Ensaio" : "Novo Ensaio"}
                  </h2>
                  {editingAlbumId && (
                    <button
                      type="button"
                      onClick={cancelEditAlbum}
                      className="text-xs text-[#2d2422]/50 hover:text-[#2d2422] underline cursor-pointer"
                    >
                      Cancelar
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveAlbum} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#2d2422]/80 mb-1.5">
                      Nome do Ensaio / Cliente *
                    </label>
                    <input
                      type="text"
                      required
                      value={albumTitle}
                      onChange={(e) => setAlbumTitle(e.target.value)}
                      placeholder="Ex: Casamento Ana & Pedro"
                      className="w-full px-4 py-3 bg-[#f4ede8]/70 border border-[#2d2422]/15 rounded-lg focus:bg-white focus:border-[#cba37b] outline-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#2d2422]/80 mb-1.5">
                        Categoria Principal *
                      </label>
                      <select
                        value={albumCategory}
                        onChange={(e) => {
                          setAlbumCategory(e.target.value);
                          setAlbumSubcategory("");
                        }}
                        className="w-full px-3.5 py-3 bg-[#f4ede8]/70 border border-[#2d2422]/15 rounded-lg focus:bg-white focus:border-[#cba37b] outline-none text-sm"
                      >
                        {rootCategories.map((c) => (
                          <option key={c.id} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#2d2422]/80 mb-1.5">
                        Pasta / Subcategoria
                      </label>
                      <select
                        value={albumSubcategory}
                        onChange={(e) => setAlbumSubcategory(e.target.value)}
                        disabled={availableSubcategoriesForAlbum.length === 0}
                        className="w-full px-3.5 py-3 bg-[#f4ede8]/70 border border-[#2d2422]/15 rounded-lg focus:bg-white focus:border-[#cba37b] outline-none text-sm disabled:opacity-50"
                      >
                        <option value="">
                          {availableSubcategoriesForAlbum.length === 0
                            ? "Sem subpastas"
                            : "Escolha a subpasta..."}
                        </option>
                        {availableSubcategoriesForAlbum.map((sub) => (
                          <option key={sub.id} value={sub.slug}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2d2422]/80 mb-1.5">
                      Foto de Capa (Opcional — ou escolha das fotos do ensaio)
                    </label>
                    <div className="border-2 border-dashed border-[#2d2422]/20 rounded-xl p-5 text-center hover:border-[#cba37b] hover:bg-[#fcfaf8] transition-all cursor-pointer relative bg-[#f4ede8]/40">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          setAlbumFile(e.target.files?.[0] || null);
                          setAlbumCoverFromExistingUrl("");
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {albumFile ? (
                        <div className="text-[#cba37b] font-medium text-sm truncate px-2">
                          ✓ {albumFile.name}
                        </div>
                      ) : albumCoverFromExistingUrl ? (
                        <div className="text-[#cba37b] font-medium text-xs px-2">
                          ✓ Foto do próprio ensaio selecionada como capa
                        </div>
                      ) : (
                        <div className="text-[#2d2422]/60 text-xs flex flex-col items-center">
                          <ImageIcon className="w-6 h-6 mb-1.5 text-[#cba37b]" />
                          <span>Enviar foto de capa do computador</span>
                          <span className="text-[10px] text-[#2d2422]/45 mt-0.5">
                            Ou escolha qualquer foto dentro do ensaio depois
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Seletor rápido de fotos do próprio ensaio ao editar */}
                  {editingAlbumId &&
                    photos.some((p) => p.album_id === editingAlbumId) && (
                      <div>
                        <label className="block text-xs font-medium text-[#2d2422]/80 mb-1.5">
                          Ou escolher uma foto deste ensaio como capa:
                        </label>
                        <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 bg-[#f4ede8]/60 rounded-xl border border-[#2d2422]/10">
                          {photos
                            .filter((p) => p.album_id === editingAlbumId)
                            .map((p) => {
                              const currentPreviewUrl =
                                albumCoverFromExistingUrl ||
                                albums.find((a) => a.id === editingAlbumId)
                                  ?.cover_url;
                              const isPicked =
                                !albumFile && currentPreviewUrl === p.url;
                              return (
                                <button
                                  type="button"
                                  key={p.id}
                                  onClick={() => {
                                    setAlbumFile(null);
                                    setAlbumCoverFromExistingUrl(p.url);
                                  }}
                                  className={clsx(
                                    "relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer",
                                    isPicked
                                      ? "border-[#cba37b] ring-2 ring-[#cba37b]/40 scale-95"
                                      : "border-transparent opacity-75 hover:opacity-100"
                                  )}
                                  title="Usar esta foto como capa"
                                >
                                  <img
                                    src={p.url}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                  {isPicked && (
                                    <span className="absolute inset-0 bg-[#cba37b]/30 flex items-center justify-center text-[10px] font-bold text-[#120f0e]">
                                      ★
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    )}

                  {(albumFile ||
                    albumCoverFromExistingUrl ||
                    (editingAlbumId &&
                      albums.find((a) => a.id === editingAlbumId)
                        ?.cover_url)) && (
                    <div>
                      <label className="block text-xs font-medium text-[#2d2422]/80 mb-1.5">
                        Enquadramento da Capa
                      </label>
                      <DragPositioner
                        imageUrl={
                          albumFile
                            ? URL.createObjectURL(albumFile)
                            : albumCoverFromExistingUrl ||
                              albums.find((a) => a.id === editingAlbumId)
                                ?.cover_url ||
                              ""
                        }
                        value={albumCoverPosition}
                        onChange={setAlbumCoverPosition}
                        aspectRatio="aspect-[4/3]"
                      />
                    </div>
                  )}

                  {/* Campo Opcional de Vídeo Resumo (Especial Debutantes / Eventos) */}
                  <div className="pt-2 border-t border-[#2d2422]/10">
                    <label className="block text-xs font-medium text-[#2d2422]/90 mb-1 flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-[#cba37b]" />
                      Vídeo Resumo do Ensaio (Debutantes / Eventos)
                    </label>
                    <p className="text-[11px] text-[#2d2422]/55 mb-2">
                      Opcional — envie um vídeo curto (.mp4/.mov) ou cole um link do YouTube/Vimeo.
                    </p>
                    <div className="space-y-2">
                      <div className="border border-dashed border-[#2d2422]/20 rounded-xl p-3 text-center hover:border-[#cba37b] transition-all cursor-pointer relative bg-[#f4ede8]/30">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            setAlbumVideoFile(e.target.files?.[0] || null);
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {albumVideoFile ? (
                          <div className="text-[#cba37b] font-medium text-xs truncate px-2">
                            🎬 {albumVideoFile.name}
                          </div>
                        ) : (
                          <div className="text-[#2d2422]/60 text-[11px] flex items-center justify-center gap-1.5">
                            <Film className="w-4 h-4 text-[#cba37b]" />
                            <span>Enviar arquivo de vídeo do computador</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="url"
                        value={albumVideoUrlInput}
                        onChange={(e) => setAlbumVideoUrlInput(e.target.value)}
                        placeholder="Ou cole o link do vídeo (YouTube, Vimeo ou MP4)..."
                        className="w-full px-3.5 py-2.5 bg-[#f4ede8]/70 border border-[#2d2422]/15 rounded-lg focus:bg-white focus:border-[#cba37b] outline-none text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={uploadingAlbum || !albumTitle}
                    className="w-full bg-[#120f0e] text-white py-3.5 rounded-xl font-medium uppercase tracking-widest text-xs hover:bg-[#cba37b] hover:text-[#120f0e] transition-colors flex items-center justify-center disabled:opacity-50 mt-4 cursor-pointer shadow-sm"
                  >
                    {uploadingAlbum ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : editingAlbumId ? (
                      "Salvar Alterações"
                    ) : (
                      "Criar Ensaio e Adicionar Fotos →"
                    )}
                  </button>
                </form>
              </div>
            </section>

            {/* Coluna Direita: Lista de Ensaios */}
            <section className="lg:col-span-2">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#2d2422]/10 min-h-[540px]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#2d2422]/10">
                  <div>
                    <h2 className="font-serif text-2xl text-[#2d2422]">
                      Ensaios Publicados
                    </h2>
                    <p className="text-xs text-[#2d2422]/60 mt-0.5">
                      Clique em qualquer ensaio para ver ou enviar novas fotos dentro dele.
                    </p>
                  </div>

                  {/* Busca e Filtro por Categoria */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-[#2d2422]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={albumSearch}
                        onChange={(e) => setAlbumSearch(e.target.value)}
                        placeholder="Buscar ensaio..."
                        className="pl-8 pr-3 py-2 bg-[#f4ede8]/70 border border-[#2d2422]/10 rounded-lg text-xs outline-none focus:border-[#cba37b] w-40"
                      />
                    </div>
                    <select
                      value={albumCategoryFilter}
                      onChange={(e) => setAlbumCategoryFilter(e.target.value)}
                      className="px-3 py-2 bg-[#f4ede8]/70 border border-[#2d2422]/10 rounded-lg text-xs outline-none focus:border-[#cba37b]"
                    >
                      <option value="all">Todas categorias</option>
                      {rootCategories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-32">
                    <Loader2 className="w-8 h-8 animate-spin text-[#cba37b]" />
                  </div>
                ) : filteredAlbums.length === 0 ? (
                  <div className="text-center py-24 text-[#2d2422]/40">
                    <FolderPlus className="w-12 h-12 mx-auto mb-3 opacity-25" />
                    <p className="text-sm">Nenhum ensaio encontrado.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredAlbums.map((album) => {
                      const count = photoCountByAlbum[album.id] || 0;
                      return (
                        <motion.div
                          key={album.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="group relative rounded-xl overflow-hidden bg-white border border-[#2d2422]/10 shadow-sm hover:shadow-md transition-all flex flex-col"
                        >
                          {/* Capa Clicável para Abrir o Álbum */}
                          <div
                            onClick={() => {
                              setOpenedAlbumId(album.id);
                              setSelectedAlbumId(album.id);
                            }}
                            className="relative aspect-[4/3] w-full overflow-hidden bg-muted cursor-pointer"
                          >
                            <img
                              src={album.cover_url}
                              alt={album.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              style={{
                                objectPosition: album.cover_position || "50% 50%",
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute top-3 left-3 flex items-center gap-1.5">
                              <span className="bg-[#cba37b] text-[#120f0e] text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md font-semibold shadow">
                                {album.category}
                                {album.subcategory ? ` · ${album.subcategory}` : ""}
                              </span>
                            </div>

                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              {albumVideoById[album.id] && (
                                <span
                                  className="bg-[#cba37b] text-[#120f0e] text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow"
                                  title="Este ensaio possui Vídeo Resumo"
                                >
                                  <Film className="w-3 h-3" /> Vídeo
                                </span>
                              )}
                              <div className="bg-black/65 backdrop-blur-sm text-white text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-white/15">
                                <Camera className="w-3.5 h-3.5 text-[#cba37b]" />
                                {count} {count === 1 ? "foto" : "fotos"}
                              </div>
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                              <div>
                                <h3 className="text-white font-serif text-xl leading-snug">
                                  {album.title}
                                </h3>
                                <span className="text-white/75 text-xs flex items-center gap-1 mt-1 group-hover:text-[#cba37b] transition-colors">
                                  <FolderOpen className="w-3.5 h-3.5" /> Abrir e gerenciar fotos
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Barra de Ações Rápidas Visível */}
                          <div className="p-3 bg-[#fcfaf8] border-t border-[#2d2422]/10 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenedAlbumId(album.id);
                                  setSelectedAlbumId(album.id);
                                }}
                                className="text-xs font-medium bg-[#120f0e] text-white hover:bg-[#cba37b] hover:text-[#120f0e] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" /> Fotos ({count})
                              </button>
                              <button
                                type="button"
                                onClick={() => startEditAlbum(album)}
                                className="text-xs text-[#2d2422]/70 hover:text-[#2d2422] hover:bg-[#2d2422]/5 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                                title="Editar título, categoria ou capa"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingAlbumPosition(album)}
                                className="text-xs text-[#2d2422]/70 hover:text-[#2d2422] hover:bg-[#2d2422]/5 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                                title="Ajustar foco da capa"
                              >
                                <Move className="w-3.5 h-3.5" /> Foco
                              </button>
                            </div>

                            <div className="flex items-center gap-1">
                              <Link
                                href={`/ensaio?id=${album.id}`}
                                target="_blank"
                                className="text-[#2d2422]/50 hover:text-[#cba37b] p-1.5 rounded-lg transition-colors"
                                title="Ver página do ensaio no site"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleDeleteAlbum(album)}
                                className="text-red-500/70 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                                title="Excluir ensaio inteiro"
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
          </div>
        )}

        {/* ============================================================================================== */}
        {/* VISÃO INTERNA DE UM ENSAIO ESPECÍFICO (GERENCIAR FOTOS DO ENSAIO) */}
        {/* ============================================================================================== */}
        {activeTab === "albums" && openedAlbum && (
          <div className="space-y-6">
            {/* Cabeçalho do Ensaio Aberto */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#2d2422]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setOpenedAlbumId(null);
                    setSelectedPhotos([]);
                  }}
                  className="p-2.5 rounded-xl bg-[#f4ede8] hover:bg-[#cba37b] hover:text-white transition-colors cursor-pointer"
                  title="Voltar para todos os ensaios"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={openedAlbum.cover_url}
                  alt={openedAlbum.title}
                  className="w-14 h-14 rounded-xl object-cover border border-[#2d2422]/10"
                  style={{
                    objectPosition: openedAlbum.cover_position || "50% 50%",
                  }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest bg-[#cba37b]/20 text-[#2d2422] px-2 py-0.5 rounded font-semibold">
                      {openedAlbum.category}
                      {openedAlbum.subcategory
                        ? ` · ${openedAlbum.subcategory}`
                        : ""}
                    </span>
                    <span className="text-xs text-[#2d2422]/50">
                      {photoCountByAlbum[openedAlbum.id] || 0} fotos neste ensaio
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl text-[#2d2422] mt-0.5">
                    {openedAlbum.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingAlbumPosition(openedAlbum)}
                  className="text-xs border border-[#2d2422]/15 hover:border-[#cba37b] px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Move className="w-3.5 h-3.5 text-[#cba37b]" /> Ajustar Foco da Capa
                </button>
                <Link
                  href={`/ensaio?id=${openedAlbum.id}`}
                  target="_blank"
                  className="text-xs bg-[#120f0e] text-white hover:bg-[#cba37b] hover:text-[#120f0e] px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Ver no Site
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload direto para este ensaio + Vídeo Resumo */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#2d2422]/10">
                  <h3 className="font-serif text-xl mb-2 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-[#cba37b]" /> Adicionar Fotos ao Ensaio
                  </h3>
                  <p className="text-xs text-[#2d2422]/60 mb-5">
                    Selecione quantas fotos quiser de uma só vez para enviar para{" "}
                    <strong>{openedAlbum.title}</strong>.
                  </p>

                  <form
                    onSubmit={(e) => handleUploadPhoto(e, openedAlbum.id)}
                    className="space-y-4"
                  >
                    <div className="border-2 border-dashed border-[#cba37b]/50 rounded-xl p-6 text-center hover:bg-[#fcfaf8] transition-colors cursor-pointer relative bg-[#f4ede8]/40">
                      <input
                        type="file"
                        accept="image/*"
                        required
                        multiple
                        onChange={(e) =>
                          setPhotoFiles(Array.from(e.target.files || []))
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {photoFiles.length > 0 ? (
                        <div className="text-[#2d2422] font-medium text-sm">
                          <span className="text-[#cba37b] font-bold">
                            {photoFiles.length}
                          </span>{" "}
                          foto(s) pronta(s) para envio
                          <p className="text-[11px] text-[#2d2422]/50 truncate mt-1">
                            {photoFiles.map((f) => f.name).join(", ")}
                          </p>
                        </div>
                      ) : (
                        <div className="text-[#2d2422]/60 text-xs flex flex-col items-center py-2">
                          <Upload className="w-7 h-7 mb-2 text-[#cba37b]" />
                          <span className="font-medium text-sm text-[#2d2422]">
                            Clique ou arraste as fotos aqui
                          </span>
                          <span className="text-[11px] text-[#2d2422]/50 mt-1">
                            Suporta seleção em massa (JPG, PNG, WEBP)
                          </span>
                        </div>
                      )}
                    </div>

                    {uploadingPhoto && uploadProgress && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span>Enviando fotos...</span>
                          <span>
                            {uploadProgress.current} de {uploadProgress.total}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#f4ede8] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#cba37b] transition-all duration-300"
                            style={{
                              width: `${Math.round(
                                (uploadProgress.current / uploadProgress.total) *
                                  100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={uploadingPhoto || photoFiles.length === 0}
                      className="w-full bg-[#120f0e] text-white py-3.5 rounded-xl font-medium uppercase tracking-widest text-xs hover:bg-[#cba37b] hover:text-[#120f0e] transition-colors flex items-center justify-center disabled:opacity-50 cursor-pointer"
                    >
                      {uploadingPhoto ? (
                        <span className="flex items-center">
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Enviando ({uploadProgress?.current}/
                          {uploadProgress?.total})...
                        </span>
                      ) : (
                        `Enviar ${
                          photoFiles.length > 0 ? `${photoFiles.length} ` : ""
                        }Foto(s) para o Ensaio`
                      )}
                    </button>
                  </form>
                </div>

                {/* Card de Vídeo Resumo do Ensaio (Especial Debutantes / Eventos) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#cba37b]/35">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif text-xl flex items-center gap-2">
                      <Film className="w-5 h-5 text-[#cba37b]" /> Vídeo Resumo do Ensaio
                    </h3>
                    {albumVideoById[openedAlbum.id] && (
                      <span className="bg-[#cba37b]/20 text-[#2d2422] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                        Ativo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#2d2422]/60 mb-4">
                    Ideal para ensaios de <strong>Debutantes</strong> e eventos! O vídeo aparece em destaque no topo da página do ensaio junto com as fotos.
                  </p>

                  {albumVideoById[openedAlbum.id] && (
                    <div className="mb-4 rounded-xl overflow-hidden bg-[#120f0e] border border-[#2d2422]/15">
                      {albumVideoById[openedAlbum.id].includes("youtube.com") ||
                      albumVideoById[openedAlbum.id].includes("youtu.be") ||
                      albumVideoById[openedAlbum.id].includes("vimeo.com") ? (
                        <div className="p-4 text-xs text-white/80 flex items-center justify-between gap-2">
                          <span className="truncate">
                            🔗 {albumVideoById[openedAlbum.id]}
                          </span>
                          <a
                            href={albumVideoById[openedAlbum.id]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#cba37b] underline shrink-0"
                          >
                            Abrir
                          </a>
                        </div>
                      ) : (
                        <video
                          src={albumVideoById[openedAlbum.id]}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full max-h-56 object-contain bg-black"
                        />
                      )}
                      <div className="p-2.5 bg-[#1a1715] flex items-center justify-between">
                        <span className="text-[11px] text-white/70">
                          Vídeo resumo publicado neste ensaio
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAlbumVideo(openedAlbum.id)}
                          className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remover vídeo
                        </button>
                      </div>
                    </div>
                  )}

                  <form
                    onSubmit={(e) => handleSaveOpenedAlbumVideo(e, openedAlbum)}
                    className="space-y-3"
                  >
                    <div className="border-2 border-dashed border-[#cba37b]/40 rounded-xl p-4 text-center hover:bg-[#fcfaf8] transition-colors cursor-pointer relative bg-[#f4ede8]/40">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          setAlbumVideoFile(e.target.files?.[0] || null)
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {albumVideoFile ? (
                        <div className="text-[#2d2422] font-medium text-xs truncate">
                          🎬 {albumVideoFile.name}
                        </div>
                      ) : (
                        <div className="text-[#2d2422]/60 text-xs flex flex-col items-center py-1">
                          <Film className="w-5 h-5 mb-1 text-[#cba37b]" />
                          <span className="font-medium text-[#2d2422]">
                            Enviar arquivo de vídeo (.mp4, .mov)
                          </span>
                        </div>
                      )}
                    </div>

                    <input
                      type="url"
                      value={albumVideoUrlInput}
                      onChange={(e) => setAlbumVideoUrlInput(e.target.value)}
                      placeholder="Ou cole o link do vídeo (YouTube, Vimeo ou MP4)..."
                      className="w-full px-3.5 py-2.5 bg-[#f4ede8]/70 border border-[#2d2422]/15 rounded-lg focus:bg-white focus:border-[#cba37b] outline-none text-xs"
                    />

                    <button
                      type="submit"
                      disabled={
                        uploadingAlbumVideo ||
                        (!albumVideoFile && !albumVideoUrlInput.trim())
                      }
                      className="w-full bg-[#120f0e] text-white py-3 rounded-xl font-medium uppercase tracking-widest text-xs hover:bg-[#cba37b] hover:text-[#120f0e] transition-colors flex items-center justify-center disabled:opacity-50 cursor-pointer"
                    >
                      {uploadingAlbumVideo ? (
                        <span className="flex items-center">
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Salvando Vídeo...
                        </span>
                      ) : albumVideoById[openedAlbum.id] ? (
                        "Substituir Vídeo Resumo"
                      ) : (
                        "Salvar Vídeo Resumo no Ensaio"
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Grade de Fotos deste Ensaio */}
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#2d2422]/10 min-h-[450px]">
                  {(() => {
                    const albumPhotos = photos.filter(
                      (p) => p.album_id === openedAlbum.id
                    );
                    const allSelected =
                      albumPhotos.length > 0 &&
                      albumPhotos.every((p) => selectedPhotos.includes(p.id));

                    return (
                      <>
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#2d2422]/10">
                          <h3 className="font-serif text-xl">
                            Fotos deste Ensaio ({albumPhotos.length})
                          </h3>

                          {albumPhotos.length > 0 && (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedPhotos(
                                    allSelected
                                      ? []
                                      : albumPhotos.map((p) => p.id)
                                  )
                                }
                                className="text-xs text-[#2d2422]/70 hover:text-[#2d2422] border border-[#2d2422]/15 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                {allSelected
                                  ? "Desmarcar todas"
                                  : "Selecionar todas"}
                              </button>
                              {selectedPhotos.length > 0 && (
                                <button
                                  type="button"
                                  onClick={handleBulkDeletePhotos}
                                  className="text-xs bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Excluir{" "}
                                  {selectedPhotos.length} selecionada(s)
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {albumPhotos.length === 0 ? (
                          <div className="text-center py-24 text-[#2d2422]/40">
                            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-25" />
                            <p className="text-sm">
                              Este ensaio ainda não tem fotos internas.
                            </p>
                            <p className="text-xs mt-1">
                              Use o quadro ao lado para enviar várias fotos de uma vez!
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                            {albumPhotos.map((photo) => {
                              const isSelected = selectedPhotos.includes(
                                photo.id
                              );
                              const isCurrentCover =
                                openedAlbum.cover_url === photo.url;
                              return (
                                <div
                                  key={photo.id}
                                  onClick={() => toggleSelectPhoto(photo.id)}
                                  className={clsx(
                                    "group relative aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer border-2 transition-all",
                                    isSelected
                                      ? "border-[#cba37b] scale-[0.97]"
                                      : isCurrentCover
                                      ? "border-[#cba37b]/70"
                                      : "border-transparent"
                                  )}
                                >
                                  <img
                                    src={photo.url}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                  <div
                                    className={clsx(
                                      "absolute top-2.5 left-2.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors z-20",
                                      isSelected
                                        ? "bg-[#cba37b] text-[#120f0e]"
                                        : "border border-white/70 bg-black/30 opacity-0 group-hover:opacity-100"
                                    )}
                                  >
                                    {isSelected && "✓"}
                                  </div>

                                  {isCurrentCover ? (
                                    <span className="absolute bottom-2.5 left-2.5 bg-[#cba37b] text-[#120f0e] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md z-20">
                                      ★ Capa Atual
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSetPhotoAsAlbumCover(
                                          openedAlbum.id,
                                          photo.url
                                        );
                                      }}
                                      className="absolute bottom-2.5 left-2.5 bg-[#120f0e]/90 hover:bg-[#cba37b] text-white hover:text-[#120f0e] text-[10px] font-medium px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-md cursor-pointer z-20"
                                      title="Definir esta foto como capa do ensaio"
                                    >
                                      ★ Usar como Capa
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeletePhoto(photo);
                                    }}
                                    className="absolute bottom-2.5 right-2.5 bg-red-600/90 hover:bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer z-20"
                                    title="Excluir esta foto"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================================================== */}
        {/* TAB 2: GALERIA GERAL & FOTOS SOLTAS */}
        {/* ============================================================================================== */}
        {activeTab === "photos" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-1">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#2d2422]/10 sticky top-36">
                <h2 className="font-serif text-2xl mb-2 flex items-center text-[#2d2422]">
                  <Upload className="w-5 h-5 mr-3 text-[#cba37b]" /> Enviar Fotos
                </h2>
                <p className="text-xs text-[#2d2422]/60 mb-6">
                  Envie fotos avulsas (que aparecem nos destaques e Instagram da Home) ou vincule a um ensaio.
                </p>

                <form onSubmit={(e) => handleUploadPhoto(e)} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#2d2422]/80 mb-1.5">
                      Selecionar Imagens (Envio em Massa) *
                    </label>
                    <div className="border-2 border-dashed border-[#2d2422]/20 rounded-xl p-6 text-center hover:border-[#cba37b] hover:bg-[#fcfaf8] transition-colors cursor-pointer relative bg-[#f4ede8]/40">
                      <input
                        type="file"
                        accept="image/*"
                        required
                        multiple
                        onChange={(e) =>
                          setPhotoFiles(Array.from(e.target.files || []))
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {photoFiles.length > 0 ? (
                        <div className="text-[#cba37b] font-semibold text-sm px-2">
                          ✓ {photoFiles.length} foto(s) selecionada(s)
                          <div className="text-[11px] text-[#2d2422]/50 font-normal truncate mt-1">
                            {photoFiles.map((f) => f.name).join(", ")}
                          </div>
                        </div>
                      ) : (
                        <div className="text-[#2d2422]/60 text-xs flex flex-col items-center">
                          <ImageIcon className="w-6 h-6 mb-2 text-[#cba37b]" />
                          Clique ou arraste várias fotos de uma vez
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2d2422]/80 mb-1.5">
                      Destino das Fotos
                    </label>
                    <select
                      value={selectedAlbumId}
                      onChange={(e) => setSelectedAlbumId(e.target.value)}
                      className="w-full px-4 py-3 bg-[#f4ede8]/70 border border-[#2d2422]/15 rounded-lg focus:bg-white focus:border-[#cba37b] outline-none text-sm"
                    >
                      <option value="">
                        ★ Fotos Soltas (Destaques da Home / Instagram)
                      </option>
                      {albums.map((a) => (
                        <option key={a.id} value={a.id}>
                          Ensaio: [{a.category.toUpperCase()}] {a.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedAlbumId === "" && (
                    <div>
                      <label className="block text-xs font-medium text-[#2d2422]/80 mb-1.5">
                        Categoria das Fotos Soltas
                      </label>
                      <select
                        value={photoCategory}
                        onChange={(e) => setPhotoCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-[#f4ede8]/70 border border-[#2d2422]/15 rounded-lg focus:bg-white focus:border-[#cba37b] outline-none text-sm"
                      >
                        {rootCategories.map((c) => (
                          <option key={c.id} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {uploadingPhoto && uploadProgress && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span>Progresso</span>
                        <span>
                          {uploadProgress.current} / {uploadProgress.total}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#f4ede8] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#cba37b] transition-all duration-300"
                          style={{
                            width: `${Math.round(
                              (uploadProgress.current / uploadProgress.total) *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploadingPhoto || photoFiles.length === 0}
                    className="w-full bg-[#120f0e] text-white py-3.5 rounded-xl font-medium uppercase tracking-widest text-xs hover:bg-[#cba37b] hover:text-[#120f0e] transition-colors flex items-center justify-center disabled:opacity-50 mt-4 cursor-pointer"
                  >
                    {uploadingPhoto ? (
                      <span className="flex items-center">
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Enviando {uploadProgress?.current} de{" "}
                        {uploadProgress?.total}...
                      </span>
                    ) : (
                      "Fazer Upload das Fotos"
                    )}
                  </button>
                </form>
              </div>
            </section>

            <section className="lg:col-span-2">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#2d2422]/10 min-h-[540px]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#2d2422]/10">
                  <div>
                    <h2 className="font-serif text-2xl text-[#2d2422]">
                      Biblioteca de Fotos ({filteredPhotos.length})
                    </h2>
                    <p className="text-xs text-[#2d2422]/60 mt-0.5">
                      Filtre por fotos soltas ou por um ensaio específico.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-[#f4ede8]/80 px-3 py-2 rounded-lg border border-[#2d2422]/10">
                      <Filter className="w-3.5 h-3.5 text-[#cba37b]" />
                      <select
                        value={photoFilter}
                        onChange={(e) => {
                          setPhotoFilter(e.target.value);
                          setSelectedPhotos([]);
                        }}
                        className="bg-transparent text-xs outline-none font-medium"
                      >
                        <option value="all">
                          Todas as fotos ({photos.length})
                        </option>
                        <option value="loose">
                          ★ Somente Fotos Soltas ({loosePhotosCount})
                        </option>
                        {albums.map((a) => (
                          <option key={a.id} value={a.id}>
                            Ensaio: {a.title} ({photoCountByAlbum[a.id] || 0})
                          </option>
                        ))}
                      </select>
                    </div>

                    {filteredPhotos.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedPhotos(
                            selectedPhotos.length === filteredPhotos.length
                              ? []
                              : filteredPhotos.map((p) => p.id)
                          )
                        }
                        className="text-xs font-medium text-[#2d2422]/70 hover:text-[#2d2422] border border-[#2d2422]/15 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        {selectedPhotos.length === filteredPhotos.length
                          ? "Desmarcar Tudo"
                          : "Selecionar Tudo"}
                      </button>
                    )}

                    {selectedPhotos.length > 0 && (
                      <button
                        type="button"
                        onClick={handleBulkDeletePhotos}
                        className="text-xs font-medium bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Excluir{" "}
                        {selectedPhotos.length}
                      </button>
                    )}
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-32">
                    <Loader2 className="w-8 h-8 animate-spin text-[#cba37b]" />
                  </div>
                ) : filteredPhotos.length === 0 ? (
                  <div className="text-center py-28 text-[#2d2422]/40">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-25" />
                    Nenhuma foto encontrada neste filtro.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredPhotos.map((photo) => {
                      const isSelected = selectedPhotos.includes(photo.id);
                      const albumName = photo.album_id
                        ? albumTitleById[photo.album_id] || "Ensaio"
                        : null;
                      return (
                        <motion.div
                          key={photo.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={clsx(
                            "group relative aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer border-2 transition-all duration-200",
                            isSelected
                              ? "border-[#cba37b] scale-95"
                              : "border-transparent"
                          )}
                          onClick={() => toggleSelectPhoto(photo.id)}
                        >
                          <img
                            src={photo.url}
                            alt=""
                            className="w-full h-full object-cover"
                          />

                          <div
                            className={clsx(
                              "absolute top-2.5 left-2.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors z-20 shadow-sm text-xs font-bold",
                              isSelected
                                ? "bg-[#cba37b] text-[#120f0e]"
                                : "border border-white/60 bg-black/30 text-transparent group-hover:border-white"
                            )}
                          >
                            ✓
                          </div>

                          <div
                            className={clsx(
                              "absolute inset-0 transition-opacity flex flex-col justify-end p-3",
                              isSelected
                                ? "bg-black/35 opacity-100"
                                : "bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100"
                            )}
                          >
                            <div className="flex justify-between items-end gap-2">
                              <div className="min-w-0">
                                <span
                                  className={clsx(
                                    "text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-semibold inline-block",
                                    albumName
                                      ? "bg-white/20 text-white backdrop-blur-sm"
                                      : "bg-[#cba37b] text-[#120f0e]"
                                  )}
                                >
                                  {albumName ? "Ensaio" : "Foto Solta"}
                                </span>
                                {albumName && (
                                  <p
                                    className="text-white text-[11px] font-medium mt-1 truncate"
                                    title={albumName}
                                  >
                                    {albumName}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {photo.album_id && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSetPhotoAsAlbumCover(
                                        photo.album_id!,
                                        photo.url
                                      );
                                    }}
                                    className="bg-[#cba37b] hover:bg-white text-[#120f0e] text-[10px] font-semibold px-2.5 py-2 rounded-lg transition-colors shadow-lg cursor-pointer"
                                    title="Usar esta foto como capa do ensaio"
                                  >
                                    ★ Capa
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePhoto(photo);
                                  }}
                                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors shadow-lg shrink-0 cursor-pointer"
                                  title="Excluir foto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ============================================================================================== */}
        {/* TAB 3: CATEGORIAS & PASTAS */}
        {/* ============================================================================================== */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-1">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#2d2422]/10 sticky top-36">
                <h2 className="font-serif text-2xl mb-6 flex items-center text-[#2d2422]">
                  <Grid className="w-5 h-5 mr-3 text-[#cba37b]" />
                  {editingCategoryId ? "Editar Categoria" : "Nova Categoria / Pasta"}
                </h2>

                <form onSubmit={handleSubmitCategory} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#2d2422]/80 mb-1.5">
                      Nome da Categoria ou Subpasta *
                    </label>
                    <input
                      type="text"
                      required
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      placeholder="Ex: Casamentos, Gestantes, Estúdio..."
                      className="w-full px-4 py-3 bg-[#f4ede8]/70 border border-[#2d2422]/15 rounded-lg focus:bg-white focus:border-[#cba37b] outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2d2422]/80 mb-1.5">
                      Identificador URL (Slug)
                    </label>
                    <input
                      type="text"
                      value={catSlug}
                      onChange={(e) =>
                        editingCategoryId && setCatSlug(e.target.value)
                      }
                      readOnly={!editingCategoryId}
                      className={clsx(
                        "w-full px-4 py-2.5 border border-[#2d2422]/10 rounded-lg outline-none text-xs",
                        editingCategoryId
                          ? "bg-[#f4ede8] focus:bg-white focus:border-[#cba37b]"
                          : "bg-[#e8e2dd]/70 text-[#2d2422]/50"
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2d2422]/80 mb-1.5">
                      Onde ela fica? (Hierarquia)
                    </label>
                    <select
                      value={catParentId}
                      onChange={(e) => setCatParentId(e.target.value)}
                      className="w-full px-4 py-3 bg-[#f4ede8]/70 border border-[#2d2422]/15 rounded-lg focus:bg-white focus:border-[#cba37b] outline-none text-sm"
                    >
                      <option value="">
                        Categoria Principal (Ex: Social, Pet)
                      </option>
                      {rootCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          Subpasta dentro de: {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {catParentId === "" && (
                    <div>
                      <label className="block text-xs font-medium text-[#2d2422]/80 mb-1.5">
                        Descrição Curta (Subtítulo da Categoria)
                      </label>
                      <textarea
                        value={catDesc}
                        onChange={(e) => setCatDesc(e.target.value)}
                        placeholder="Texto descritivo que aparece no topo da categoria..."
                        className="w-full px-4 py-3 bg-[#f4ede8]/70 border border-[#2d2422]/15 rounded-lg focus:bg-white focus:border-[#cba37b] outline-none text-sm h-24 resize-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-[#2d2422]/80 mb-1.5">
                      Foto de Capa
                    </label>
                    <div className="border-2 border-dashed border-[#2d2422]/20 rounded-xl p-5 text-center hover:border-[#cba37b] transition-colors cursor-pointer relative bg-[#f4ede8]/40">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setCatFile(e.target.files?.[0] || null)
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {catFile ? (
                        <div className="text-[#cba37b] font-medium text-sm truncate px-2">
                          ✓ {catFile.name}
                        </div>
                      ) : (
                        <div className="text-[#2d2422]/60 text-xs flex flex-col items-center">
                          <ImageIcon className="w-6 h-6 mb-1.5 text-[#cba37b]" />
                          Clique para escolher uma imagem de capa
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-medium text-[#2d2422]/80 mb-1.5">
                        Enquadramento da Capa
                      </label>
                      <DragPositioner
                        imageUrl={
                          catFile
                            ? URL.createObjectURL(catFile)
                            : categories.find((c) => c.id === editingCategoryId)
                                ?.cover_url || ""
                        }
                        value={catCoverPosition}
                        onChange={setCatCoverPosition}
                        aspectRatio="aspect-video"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="catIsHidden"
                      checked={catIsHidden}
                      onChange={(e) => setCatIsHidden(e.target.checked)}
                      className="accent-[#cba37b] w-4 h-4 cursor-pointer"
                    />
                    <label
                      htmlFor="catIsHidden"
                      className="text-xs text-[#2d2422] cursor-pointer"
                    >
                      Ocultar temporariamente esta categoria no site
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={uploadingCategory || !catName || !catSlug}
                      className="flex-1 bg-[#120f0e] text-white py-3.5 rounded-xl font-medium uppercase tracking-widest text-xs hover:bg-[#cba37b] hover:text-[#120f0e] transition-colors flex items-center justify-center disabled:opacity-50 cursor-pointer"
                    >
                      {uploadingCategory ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : editingCategoryId ? (
                        "Salvar Alterações"
                      ) : (
                        "Criar Categoria"
                      )}
                    </button>
                    {editingCategoryId && (
                      <button
                        type="button"
                        onClick={cancelEditCategory}
                        className="border border-[#2d2422]/20 text-[#2d2422] py-3.5 px-5 rounded-xl font-medium uppercase tracking-widest text-xs hover:bg-[#2d2422]/5 transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </section>

            <section className="lg:col-span-2">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#2d2422]/10">
                <div className="mb-6 pb-4 border-b border-[#2d2422]/10">
                  <h2 className="font-serif text-2xl text-[#2d2422]">
                    Estrutura de Categorias e Subpastas
                  </h2>
                  <p className="text-xs text-[#2d2422]/60 mt-1">
                    Arraste pelo ícone <GripVertical className="w-3.5 h-3.5 inline" /> para reordenar como elas aparecem no menu e na página de Ensaios.
                  </p>
                </div>

                {loading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#cba37b]" />
                  </div>
                ) : rootCategories.length === 0 ? (
                  <div className="text-center py-20 text-[#2d2422]/40">
                    Nenhuma categoria criada.
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEndRoots}
                  >
                    <SortableContext
                      items={rootCategories.map((r) => r.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-6">
                        {rootCategories.map((root) => (
                          <SortableItem
                            key={root.id}
                            id={root.id}
                            className="border border-[#2d2422]/10 rounded-xl overflow-hidden bg-white shadow-xs"
                          >
                            {(dragHandleProps) => (
                              <>
                                <div className="bg-[#f4ede8] p-4 flex justify-between items-center">
                                  <div className="flex items-center gap-3.5">
                                    <div
                                      className="cursor-grab text-[#2d2422]/40 hover:text-[#cba37b] p-1"
                                      {...dragHandleProps}
                                      title="Arraste para reordenar"
                                    >
                                      <GripVertical className="w-5 h-5" />
                                    </div>
                                    {root.cover_url && (
                                      <img
                                        src={root.cover_url}
                                        alt={root.name}
                                        className="w-12 h-12 object-cover rounded-lg shadow-xs"
                                        style={{
                                          objectPosition:
                                            root.cover_position || "50% 50%",
                                        }}
                                      />
                                    )}
                                    <div>
                                      <h3 className="font-serif text-xl">
                                        {root.name}
                                      </h3>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span className="bg-[#cba37b]/25 text-[#2d2422] text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-medium">
                                          Principal
                                        </span>
                                        <span className="text-[11px] text-[#2d2422]/50">
                                          /{root.slug}
                                        </span>
                                        {root.is_hidden && (
                                          <span className="bg-red-500/15 text-red-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-medium">
                                            Oculta
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleToggleCategoryVisibility(
                                          root.id,
                                          !!root.is_hidden
                                        )
                                      }
                                      className="text-[#2d2422]/60 hover:text-[#cba37b] p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
                                      title={
                                        root.is_hidden
                                          ? "Mostrar no site"
                                          : "Ocultar no site"
                                      }
                                    >
                                      {root.is_hidden ? (
                                        <EyeOff className="w-4 h-4" />
                                      ) : (
                                        <Eye className="w-4 h-4" />
                                      )}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleEditCategory(root)}
                                      className="text-[#2d2422]/60 hover:text-[#cba37b] p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
                                      title="Editar categoria"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteCategory(root.id)
                                      }
                                      className="text-red-500/80 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                      title="Excluir categoria"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                <DndContext
                                  sensors={sensors}
                                  collisionDetection={closestCenter}
                                  onDragEnd={(e) =>
                                    handleDragEndChildren(e, root.id)
                                  }
                                >
                                  <SortableContext
                                    items={childCategories
                                      .filter((c) => c.parent_id === root.id)
                                      .map((c) => c.id)}
                                    strategy={rectSortingStrategy}
                                  >
                                    <div className="p-4 bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                      {childCategories
                                        .filter((c) => c.parent_id === root.id)
                                        .map((child) => (
                                          <SortableItem
                                            key={child.id}
                                            id={child.id}
                                            className="group rounded-xl border border-[#2d2422]/10 p-3 flex items-center gap-3 bg-[#fcfaf8] hover:border-[#cba37b]/50 transition-colors"
                                          >
                                            {(childDragHandleProps) => (
                                              <>
                                                <div
                                                  className="cursor-grab text-[#2d2422]/30 hover:text-[#cba37b] shrink-0"
                                                  {...childDragHandleProps}
                                                >
                                                  <GripVertical className="w-4 h-4" />
                                                </div>
                                                {child.cover_url ? (
                                                  <img
                                                    src={child.cover_url}
                                                    alt={child.name}
                                                    className="w-11 h-11 object-cover rounded-lg shrink-0"
                                                    style={{
                                                      objectPosition:
                                                        child.cover_position ||
                                                        "50% 50%",
                                                    }}
                                                  />
                                                ) : (
                                                  <div className="w-11 h-11 bg-[#f4ede8] flex items-center justify-center rounded-lg shrink-0 text-[#cba37b]">
                                                    <ImageIcon className="w-4 h-4" />
                                                  </div>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                  <p className="font-medium text-sm text-[#2d2422] truncate">
                                                    {child.name}
                                                  </p>
                                                  <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-[10px] text-[#2d2422]/45 truncate">
                                                      {child.slug}
                                                    </span>
                                                    {child.is_hidden && (
                                                      <span className="bg-red-500/10 text-red-600 text-[9px] uppercase px-1.5 rounded font-medium">
                                                        Oculta
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-0.5">
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      handleToggleCategoryVisibility(
                                                        child.id,
                                                        !!child.is_hidden
                                                      )
                                                    }
                                                    className="text-[#2d2422]/40 hover:text-[#cba37b] p-1.5 transition-colors cursor-pointer"
                                                    title={
                                                      child.is_hidden
                                                        ? "Mostrar"
                                                        : "Ocultar"
                                                    }
                                                  >
                                                    {child.is_hidden ? (
                                                      <EyeOff className="w-3.5 h-3.5" />
                                                    ) : (
                                                      <Eye className="w-3.5 h-3.5" />
                                                    )}
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      handleEditCategory(child)
                                                    }
                                                    className="text-[#2d2422]/40 hover:text-[#cba37b] p-1.5 transition-colors cursor-pointer"
                                                    title="Editar subpasta"
                                                  >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      handleDeleteCategory(
                                                        child.id
                                                      )
                                                    }
                                                    className="text-red-500/70 hover:text-red-600 p-1.5 cursor-pointer"
                                                    title="Excluir subpasta"
                                                  >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                  </button>
                                                </div>
                                              </>
                                            )}
                                          </SortableItem>
                                        ))}
                                      {childCategories.filter(
                                        (c) => c.parent_id === root.id
                                      ).length === 0 && (
                                        <p className="col-span-full text-xs text-[#2d2422]/40 italic py-2">
                                          Nenhuma subpasta dentro de {root.name}.
                                        </p>
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
          </div>
        )}

        {/* ============================================================================================== */}
        {/* TAB 4: PERSONALIZAR PÁGINAS DO SITE (HOME, SOBRE E CONTATO) */}
        {/* ============================================================================================== */}
        {activeTab === "settings" && (
          <div className="space-y-8">
            {/* Bloco 1: Ensaios em Destaque nas Faixas da Home e Sobre */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#2d2422]/10">
              <div className="max-w-3xl mb-6">
                <span className="text-[10px] uppercase tracking-widest text-[#cba37b] font-semibold">
                  Galerias Automáticas
                </span>
                <h2 className="font-serif text-2xl md:text-3xl text-[#2d2422] mt-1">
                  Ensaios em Destaque na Home e Página Sobre
                </h2>
                <p className="text-xs text-[#2d2422]/60 mt-1">
                  Escolha quais ensaios alimentam automaticamente as faixas horizontais de fotos na Home e na seção &ldquo;Lucky e Alice&rdquo; da página Sobre.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#f4ede8]/50 p-5 rounded-xl border border-[#2d2422]/10">
                  <label className="block text-xs font-semibold text-[#2d2422] mb-1">
                    Faixa Superior do Mosaico (Home)
                  </label>
                  <p className="text-[11px] text-[#2d2422]/55 mb-3">
                    Exibe até 6 fotos deste ensaio na primeira faixa da Home.
                  </p>
                  <div className="flex gap-2 items-center">
                    <select
                      value={
                        settings.find((s) => s.key === "home_masonry_album_2")
                          ?.url || ""
                      }
                      onChange={(e) =>
                        handleSaveTextSetting(
                          "home_masonry_album_2",
                          e.target.value,
                          "Ensaio Mosaico 2 da Home",
                          "Home Dinâmica"
                        )
                      }
                      disabled={uploadingSettingKey === "home_masonry_album_2"}
                      className="flex-1 px-3.5 py-2.5 bg-white border border-[#2d2422]/15 rounded-lg focus:border-[#cba37b] outline-none text-xs"
                    >
                      <option value="">Selecione um ensaio...</option>
                      {albums.map((a) => (
                        <option key={a.id} value={a.id}>
                          [{a.category.toUpperCase()}] {a.title}
                        </option>
                      ))}
                    </select>
                    {uploadingSettingKey === "home_masonry_album_2" && (
                      <Loader2 className="w-4 h-4 animate-spin text-[#cba37b]" />
                    )}
                  </div>
                </div>

                <div className="bg-[#f4ede8]/50 p-5 rounded-xl border border-[#2d2422]/10">
                  <label className="block text-xs font-semibold text-[#2d2422] mb-1">
                    Faixa Inferior do Mosaico (Home)
                  </label>
                  <p className="text-[11px] text-[#2d2422]/55 mb-3">
                    Exibe até 6 fotos deste ensaio na segunda faixa da Home.
                  </p>
                  <div className="flex gap-2 items-center">
                    <select
                      value={
                        settings.find((s) => s.key === "home_masonry_album")
                          ?.url || ""
                      }
                      onChange={(e) =>
                        handleSaveTextSetting(
                          "home_masonry_album",
                          e.target.value,
                          "Ensaio Mosaico 1 da Home",
                          "Home Dinâmica"
                        )
                      }
                      disabled={uploadingSettingKey === "home_masonry_album"}
                      className="flex-1 px-3.5 py-2.5 bg-white border border-[#2d2422]/15 rounded-lg focus:border-[#cba37b] outline-none text-xs"
                    >
                      <option value="">Selecione um ensaio...</option>
                      {albums.map((a) => (
                        <option key={a.id} value={a.id}>
                          [{a.category.toUpperCase()}] {a.title}
                        </option>
                      ))}
                    </select>
                    {uploadingSettingKey === "home_masonry_album" && (
                      <Loader2 className="w-4 h-4 animate-spin text-[#cba37b]" />
                    )}
                  </div>
                </div>

                <div className="bg-[#f4ede8]/50 p-5 rounded-xl border border-[#2d2422]/10">
                  <label className="block text-xs font-semibold text-[#2d2422] mb-1">
                    Tira de Fotos &ldquo;Lucky e Alice&rdquo; (Página Sobre)
                  </label>
                  <p className="text-[11px] text-[#2d2422]/55 mb-3">
                    Exibe até 6 fotos deste ensaio na seção Minha Inspiração.
                  </p>
                  <div className="flex gap-2 items-center">
                    <select
                      value={
                        settings.find((s) => s.key === "sobre_pets_album")
                          ?.url || ""
                      }
                      onChange={(e) =>
                        handleSaveTextSetting(
                          "sobre_pets_album",
                          e.target.value,
                          "Ensaio Pets da Página Sobre",
                          "Sobre Dinâmica"
                        )
                      }
                      disabled={uploadingSettingKey === "sobre_pets_album"}
                      className="flex-1 px-3.5 py-2.5 bg-white border border-[#2d2422]/15 rounded-lg focus:border-[#cba37b] outline-none text-xs"
                    >
                      <option value="">Selecione um ensaio...</option>
                      {albums.map((a) => (
                        <option key={a.id} value={a.id}>
                          [{a.category.toUpperCase()}] {a.title}
                        </option>
                      ))}
                    </select>
                    {uploadingSettingKey === "sobre_pets_album" && (
                      <Loader2 className="w-4 h-4 animate-spin text-[#cba37b]" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco 2: Imagens Fixas de Cada Página */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#2d2422]/10">
              <div className="max-w-3xl mb-8">
                <span className="text-[10px] uppercase tracking-widest text-[#cba37b] font-semibold">
                  Identidade Visual
                </span>
                <h2 className="font-serif text-2xl md:text-3xl text-[#2d2422] mt-1">
                  Fotos das Páginas (Home, Sobre e Contato)
                </h2>
                <p className="text-xs text-[#2d2422]/60 mt-1">
                  Clique em <strong>Trocar Foto</strong> para enviar uma nova imagem ou em <strong>Ajustar Foco</strong> para escolher o enquadramento perfeito.
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center py-24">
                  <Loader2 className="w-8 h-8 animate-spin text-[#cba37b]" />
                </div>
              ) : Object.keys(groupedSettings).length === 0 ? (
                <div className="text-center py-20 text-[#2d2422]/40">
                  Nenhuma configuração de imagem encontrada.
                </div>
              ) : (
                <div className="space-y-12">
                  {Object.entries(groupedSettings).map(
                    ([section, sectionSettings]) => (
                      <div key={section}>
                        <h3 className="text-xl font-serif text-[#2d2422] mb-5 pb-2 border-b border-[#2d2422]/10 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#cba37b]" />
                          Página: {section}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {sectionSettings.map((setting) => {
                            const helper = SETTING_HELPERS[setting.key];
                            return (
                              <div
                                key={setting.key}
                                className="rounded-xl border border-[#2d2422]/10 bg-[#fcfaf8] overflow-hidden flex flex-col justify-between shadow-xs hover:border-[#cba37b]/60 transition-all"
                              >
                                <div className="p-4 pb-3">
                                  <h4 className="font-medium text-sm text-[#2d2422] leading-snug">
                                    {helper?.label || setting.title}
                                  </h4>
                                  {helper?.hint && (
                                    <p className="text-[11px] text-[#2d2422]/55 mt-1 leading-relaxed">
                                      {helper.hint}
                                    </p>
                                  )}
                                </div>

                                <div className="relative aspect-[4/3] w-full bg-muted overflow-hidden border-y border-[#2d2422]/10">
                                  {setting.url ? (
                                    <img
                                      src={setting.url}
                                      alt={setting.title}
                                      className="w-full h-full object-cover"
                                      style={{
                                        objectPosition:
                                          setting.cover_position || "50% 50%",
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-[#2d2422]/40">
                                      Sem imagem definida
                                    </div>
                                  )}

                                  {uploadingSettingKey === setting.key && (
                                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-xs gap-2">
                                      <Loader2 className="w-6 h-6 animate-spin text-[#cba37b]" />
                                      Enviando nova foto...
                                    </div>
                                  )}
                                </div>

                                <div className="p-3 bg-white flex items-center justify-between gap-2">
                                  <label className="flex-1 bg-[#120f0e] hover:bg-[#cba37b] text-white hover:text-[#120f0e] text-xs font-medium py-2 px-3 rounded-lg text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                                    <Upload className="w-3.5 h-3.5" /> Trocar Foto
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      disabled={
                                        uploadingSettingKey === setting.key
                                      }
                                      onChange={(e) => {
                                        if (
                                          e.target.files &&
                                          e.target.files[0]
                                        ) {
                                          handleUploadSetting(
                                            setting.key,
                                            e.target.files[0]
                                          );
                                        }
                                      }}
                                    />
                                  </label>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setEditingSettingPosition(setting)
                                    }
                                    className="border border-[#2d2422]/15 hover:border-[#cba37b] text-[#2d2422] text-xs font-medium py-2 px-3 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <Move className="w-3.5 h-3.5 text-[#cba37b]" />{" "}
                                    Ajustar Foco
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* MODAIS DE AJUSTE DE FOCO (PORTAL) */}
      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
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
                    className="bg-[#f4ede8] rounded-2xl p-6 md:p-8 max-w-md w-full border border-[#2d2422]/10 shadow-2xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-serif text-2xl text-[#2d2422]">
                        Ajustar Foco da Imagem
                      </h3>
                      <button
                        type="button"
                        onClick={() => setEditingSettingPosition(null)}
                        className="text-[#2d2422]/50 hover:text-[#2d2422] p-1 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-[#2d2422]/60 text-xs mb-5">
                      Clique e arraste a imagem para posicionar o rosto ou ponto principal exatamente onde desejar.
                    </p>

                    <div className="bg-white p-2.5 rounded-xl shadow-inner">
                      <DragPositioner
                        imageUrl={editingSettingPosition.url}
                        value={
                          editingSettingPosition.cover_position || "50% 50%"
                        }
                        onChange={(val) =>
                          setEditingSettingPosition({
                            ...editingSettingPosition,
                            cover_position: val,
                          })
                        }
                        aspectRatio={
                          SETTING_HELPERS[editingSettingPosition.key]?.aspect ||
                          "aspect-video"
                        }
                      />
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        type="button"
                        onClick={async () => {
                          await handleUpdateSettingPosition(
                            editingSettingPosition.key,
                            editingSettingPosition.cover_position || "50% 50%"
                          );
                          setEditingSettingPosition(null);
                        }}
                        className="flex-1 bg-[#120f0e] text-white py-3.5 rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-[#cba37b] hover:text-[#120f0e] transition-colors cursor-pointer"
                      >
                        Salvar Enquadramento
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingSettingPosition(null)}
                        className="px-5 border border-[#2d2422]/20 text-[#2d2422] py-3.5 rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-[#2d2422]/5 transition-colors cursor-pointer"
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
                    className="bg-[#f4ede8] rounded-2xl p-6 md:p-8 max-w-md w-full border border-[#2d2422]/10 shadow-2xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-serif text-2xl text-[#2d2422]">
                        Ajustar Capa do Ensaio
                      </h3>
                      <button
                        type="button"
                        onClick={() => setEditingAlbumPosition(null)}
                        className="text-[#2d2422]/50 hover:text-[#2d2422] p-1 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-[#2d2422]/60 text-xs mb-5">
                      Arraste a foto abaixo para escolher o enquadramento de capa de{" "}
                      <strong>{editingAlbumPosition.title}</strong>.
                    </p>

                    <div className="bg-white p-2.5 rounded-xl shadow-inner">
                      <DragPositioner
                        imageUrl={editingAlbumPosition.cover_url}
                        value={editingAlbumPosition.cover_position || "50% 50%"}
                        onChange={(val) =>
                          setEditingAlbumPosition({
                            ...editingAlbumPosition,
                            cover_position: val,
                          })
                        }
                        aspectRatio="aspect-[4/3]"
                      />
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        type="button"
                        onClick={async () => {
                          await handleUpdateAlbumPosition(
                            editingAlbumPosition.id,
                            editingAlbumPosition.cover_position || "50% 50%"
                          );
                          setEditingAlbumPosition(null);
                        }}
                        className="flex-1 bg-[#120f0e] text-white py-3.5 rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-[#cba37b] hover:text-[#120f0e] transition-colors cursor-pointer"
                      >
                        Salvar Posição
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingAlbumPosition(null)}
                        className="px-5 border border-[#2d2422]/20 text-[#2d2422] py-3.5 rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-[#2d2422]/5 transition-colors cursor-pointer"
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
