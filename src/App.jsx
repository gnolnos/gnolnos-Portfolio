import React, { useState, useEffect } from 'react';
import { 
  Mic, Video, Scissors, Play, Mail, Phone, Facebook, Linkedin, Youtube, Instagram, ChevronRight, Star, Target, Heart, AlertCircle, Menu, X, Sparkles, Wand2, Bot, Loader, Server, Cpu, Zap, Wifi, Home, Music 
} from 'lucide-react';
//import { useForm, ValidationError } from '@formspree/react';

const iconMap = {
  Server: <Server size={32} />,
  Cpu: <Cpu size={32} />,
  Zap: <Zap size={32} />,
  Wifi: <Wifi size={32} />,
  Home: <Home size={32} />,
  Music: <Music size={32} />
};
// Helper function để lấy Google Drive ID
const getGoogleDriveId = (src) => {
  const regExp = /(?:id=|\/d\/)([\w-]+)/;
  const match = src.match(regExp);
  return match ? match[1] : null;
};

// 1. Xử lý Link YouTube
const getYouTubeEmbedUrl = (src) => {
    //if (!link) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = src.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};
// Helper function để render trình phát Media
const MediaPlayer = ({ type, src, poster }) => {
  if (!src) return <div className="text-slate-500 text-xs">Chưa có file media</div>;

  // Kiểm tra xem có phải link Google Drive không
  const isGoogleDrive = src.includes('drive.google.com');
  const driveId = isGoogleDrive ? getGoogleDriveId(src) : null;
  const isYouTube = src.includes('youtube');
  const youtubeEmbed = isYouTube ? getYouTubeEmbedUrl(src) : null;
  // 2. Kiểm tra Video trực tiếp (Nextcloud, Jellyfin, MP4 file)
  const isDirectVideo = (src) => {
      //if (!link) return false;
      
      // Kiểm tra các dấu hiệu của Direct Link:
      // - Đuôi file video (.mp4, .webm)
      // - Link Nextcloud (/download)
      // - Link Jellyfin (/stream)
      return src.match(/\.(mp4|webm|ogg|mov)$/i) || 
            src.includes('/download') || 
            src.includes('/stream');
  };
  const isDirect = isDirectVideo(src);
  // 3. Xử lý Link Jellyfin (Tự động thêm API Key)
  const processVideoUrl = (src) => {
      //if (!src) return "";
      
      // Nếu là link Jellyfin (chứa /stream) và chưa có api_key
      if (src.includes('/stream') && !src.includes('api_key') && data.personalInfo.socials.jellyfin?.apiKey) {
          // Kiểm tra xem URL đã có tham số query nào chưa để dùng ? hoặc &
          const separator = src.includes('?') ? '&' : '?';
          return `${src}${separator}api_key=${data.personalInfo.socials.jellyfin.apiKey}`;
      }
      
      return src;
  };
  const processedUrl = processVideoUrl(src);

  if (youtubeEmbed) {
      return (
          <div className="w-full aspect-video bg-black relative group-hover:shadow-lg transition-all">
              <iframe 
                  className="w-full h-full object-cover"
                  src={youtubeEmbed} 
                  title="MediaPlayer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
              ></iframe>
          </div>
      );
  }

  if (isDirect) {
      return (
          <div className="w-full aspect-video bg-black relative group-hover:shadow-lg transition-all flex items-center justify-center bg-slate-800">
              {/* Thẻ Video HTML5 hỗ trợ play trực tiếp link Jellyfin/Nextcloud 
                  playsInline: Hỗ trợ play trên mobile không bị full screen
              */}
              <video 
                  className="w-full h-full object-cover"
                  controls
                  playsInline 
                  preload="metadata"
              >
                  <source src={processedUrl} type="video/mp4" />
                  <source src={processedUrl} type="video/webm" />
                  Trình duyệt của bạn không hỗ trợ thẻ video.
              </video>
          </div>
      );
  }
  // Xử lý riêng cho Google Drive (Dùng Iframe Embed để đảm bảo play được)
  if (isGoogleDrive && driveId) {
    return (
      <div className={`w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-700 ${type === 'audio' ? 'h-[100px]' : 'aspect-video'} mt-4`}>
        <iframe
          src={`https://drive.google.com/file/d/${driveId}/preview`}
          className="w-full h-full"
          allow="autoplay"
          title="Media Player"
        ></iframe>
      </div>
    );
  }

  // Trình phát chuẩn cho file Local (NAS) hoặc Direct Link khác
  if (type === 'audio') {
    return (
      <div className="w-full mt-4">
        <audio controls className="w-full h-10 rounded-lg bg-slate-100 block">
          <source src={src} type="audio/mpeg" />
          Trình duyệt của bạn không hỗ trợ thẻ audio.
        </audio>
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black mt-4 group">
        <video 
          controls 
          className="w-full h-full object-contain"
          poster={poster} 
          preload="metadata"
        >
          <source src={src} type="video/mp4" />
          Trình duyệt không hỗ trợ video.
        </video>
      </div>
    );
  }
  return null;
};



// Cấu hình mặc định (Fallback) để chạy trong Preview hoặc khi chưa có file config.json
const DEFAULT_CONFIG = {
  "personalInfo": {
    "brandName": "MY.PORTFOLIO",
    "fullName": "Nguyễn Văn A",
    "role": "CREATIVE CONTENT CREATOR",
    "intro": "Tôi kể chuyện thông qua Giọng nói, Hình ảnh. Đồng thời là một Tech Enthusiast với niềm đam mê bất tận về Home Lab & Smart Home.",
    "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    "contact": {
      "email": "contact@yourname.com",
      "phone": "0909 123 456"
    },
    "socials": {
      "facebook": "#",
      "linkedin": "#",
      "youtube": "#",
      "instagram": "#"
    }
  },
  "about": {
    "strengths": [
      "Giọng đọc đa dạng, truyền cảm",
      "Tự tin trước ống kính",
      "Tư duy dựng phim kể chuyện"
    ],
    "hobbies": [
      "Du lịch trải nghiệm",
      "Setup Home Lab & SmartHome",
      "Sưu tầm Microphone"
    ],
    "goals": [
      "Trở thành Top Voice 2025",
      "Xây dựng kênh YouTube 100k Subs",
      "Hợp tác với các brand quốc tế"
    ],
    "weaknesses": [
      "Quá cầu toàn, hay sửa đi sửa lại",
      "Hay quên ăn khi đang edit dở",
      "Mù đường dù có Google Maps"
    ]
  },
  "portfolioData": {
    "voiceover": [
      { "id": 1, "title": "TVC Quảng cáo Coffee House", "duration": "0:45", "type": "Commercial", "desc": "Giọng nam trầm, ấm, truyền cảm hứng." },
      { "id": 2, "title": "Review Sách: Nhà Giả Kim", "duration": "5:20", "type": "Podcast", "desc": "Giọng kể chuyện, nhẹ nhàng, sâu lắng." },
      { "id": 3, "title": "Lồng tiếng nhân vật Game RPG", "duration": "1:15", "type": "Character", "desc": "Đa dạng tông giọng, biểu cảm mạnh." }
    ],
    "presenter": [
      { "id": 1, "title": "Host sự kiện Tech Summit 2024", "type": "Event", "image": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800", "desc": "Dẫn chương trình song ngữ Anh-Việt, phong cách chuyên nghiệp." },
      { "id": 2, "title": "Review Ẩm Thực Đường Phố", "type": "Vlog", "image": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800", "desc": "Phong cách năng động, hài hước, gần gũi." }
    ],
    "editor": [
      { "id": 1, "title": "MV Ca Nhạc - Mùa Hè Xanh", "type": "Music Video", "image": "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800", "desc": "Color grading, hiệu ứng chuyển cảnh theo nhịp." },
      { "id": 2, "title": "Corporate Video - Vingroup", "type": "Business", "image": "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800", "desc": "Dựng phim doanh nghiệp, motion graphics cơ bản." },
      { "id": 3, "title": "Highlight Reel Du Lịch", "type": "Travel", "image": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800", "desc": "Kỹ thuật Speed ramp, sound design chi tiết." }
    ]
  },
  "techPassions": [
    { "id": "homelab", "iconName": "Server", "title": "Home Lab & Server", "desc": "Vận hành hệ thống Proxmox & TrueNAS. Quản trị ảo hóa, Docker container và lưu trữ dữ liệu tập trung.", "color": "text-blue-400", "bg": "bg-blue-500/10" },
    { "id": "smarthome", "iconName": "Home", "title": "Smart Home (IoT)", "desc": "Setup hệ sinh thái Home Assistant. Tự động hóa ánh sáng, rèm cửa và kịch bản ngữ cảnh thông minh.", "color": "text-green-400", "bg": "bg-green-500/10" },
    { "id": "network", "iconName": "Wifi", "title": "Network Admin", "desc": "Quản trị mạng nội bộ (LAN/VLAN), cấu hình Router Mikrotik/Ubiquiti, Firewall và VPN bảo mật.", "color": "text-purple-400", "bg": "bg-purple-500/10" },
    { "id": "solar", "iconName": "Zap", "title": "Năng Lượng Mặt Trời", "desc": "Đam mê năng lượng tái tạo. Theo dõi hiệu suất pin mặt trời và tối ưu hóa điện năng tiêu thụ.", "color": "text-yellow-400", "bg": "bg-yellow-500/10" },
    { "id": "studio", "iconName": "Music", "title": "Professional Studio", "desc": "Phòng thu âm chuẩn Acoustic. Trang thiết bị High-end: Microphone Neumann, Soundcard RME, Monitor Genelec.", "color": "text-rose-400", "bg": "bg-rose-500/10" },
    { "id": "tech", "iconName": "Cpu", "title": "Hi-Tech Enthusiast", "desc": "Luôn cập nhật xu hướng công nghệ mới nhất. Review và trải nghiệm các thiết bị kỹ thuật số.", "color": "text-cyan-400", "bg": "bg-cyan-500/10" }
  ],
  "skills": [
    "Adobe Premiere", "Audition", "Davinci Resolve", "After Effects",
    "Proxmox VE", "Home Assistant", "TrueNAS Scale", "Docker"
  ]
};

const App = () => {
  const [activeTab, setActiveTab] = useState('presenter');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  
  // Khởi tạo data với DEFAULT_CONFIG ngay lập tức để tránh lỗi khi fetch thất bại trong preview
  const [data, setData] = useState(DEFAULT_CONFIG);
  const [loadingConfig, setLoadingConfig] = useState(false);

  useEffect(() => {
    // 1. Scroll Effect
    const handleScroll = () => { setScrolled(window.scrollY > 50); };
    window.addEventListener('scroll', handleScroll);

    // 2. Load Config Data (Async)
    // Trong môi trường thực tế, file này sẽ được mount từ NAS vào container
    const loadConfig = async () => {
      try {
        // [QUAN TRỌNG] Đổi đường dẫn fetch vào thư mục /data/
        // Thư mục này sẽ được map từ bên ngoài vào khi chạy Docker
        const response = await fetch('/data/config.json');
        if (response.ok) {
          const config = await response.json();
          setData(config);
        } else {
            console.warn("Không tìm thấy /data/config.json, thử fallback về /config.json cũ...");
            const fallbackResponse = await fetch('/config.json');
            if (fallbackResponse.ok) {
                 const fallbackConfig = await fallbackResponse.json();
                 setData(fallbackConfig);
            }
        }
      } catch (error) {
        console.log("Sử dụng cấu hình mặc định (Preview Mode hoặc chưa mount volume)");
      }
    };

    loadConfig();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) { element.scrollIntoView({ behavior: 'smooth' }); }
  };

  const handleAiGenerate = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true); setAiError(null); setAiResult(null);
    
    // Lưu ý: Trong môi trường Vite thực tế, bạn sẽ dùng: import.meta.env.VITE_GEMINI_API_KEY
    // Tại đây ta để chuỗi rỗng để tránh lỗi cú pháp trong môi trường preview cũ
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
    
    const prompt = `Bạn là một Đạo diễn Âm thanh (Voice Director). Phân tích đoạn: "${aiInput}". Trả về: 1. Kịch Bản Đề Xuất, 2. Chỉ Đạo Diễn Xuất, 3. Lý do.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      if (!response.ok) throw new Error('Không thể kết nối với AI Server.');
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) setAiResult(text);
      else throw new Error('Không nhận được phản hồi từ AI.');
    } catch (error) {
      setAiError("Xin lỗi, hệ thống AI đang bận hoặc chưa cấu hình API Key.");
    } finally { setIsAiLoading(false); }
  };

  // Loading Screen chỉ hiện khi chúng ta thực sự muốn chặn giao diện, hiện tại ta dùng fallback nên không cần.
  if (loadingConfig) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <Loader size={48} className="animate-spin text-rose-500" />
        <span className="ml-4">Đang tải dữ liệu portfolio...</span>
      </div>
    );
  }

  // Nếu không load được data (và không có fallback), hiển thị lỗi
  if (!data) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4 text-center">
        <AlertCircle size={48} className="text-rose-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Chưa tìm thấy file cấu hình</h2>
        <p className="text-slate-400 max-w-md">
          Vui lòng đảm bảo file <code>config.json</code> đã được tạo trong thư mục <code>public/</code> hoặc được map đúng volume trong Docker.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-rose-500 selection:text-white">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 shadow-lg backdrop-blur-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-300 cursor-pointer" onClick={() => scrollToSection('home')}>
            {data.personalInfo.brandName}
          </div>
          <div className="hidden md:flex space-x-6 lg:space-x-8 text-xs lg:text-sm font-medium">
            {['Về Tôi', 'Kỹ Năng', 'Sản Phẩm', 'Tech & Gear', 'AI Studio', 'Liên Hệ'].map((item) => (
              <button key={item} onClick={() => scrollToSection(item === 'Sản Phẩm' ? 'portfolio' : item === 'Về Tôi' ? 'about' : item === 'Kỹ Năng' ? 'skills' : item === 'Tech & Gear' ? 'tech-gear' : item === 'AI Studio' ? 'ai-studio' : 'contact')} className="hover:text-rose-400 transition-colors uppercase tracking-widest flex items-center gap-1">
                {item === 'AI Studio' && <Sparkles size={14} className="text-yellow-400" />}
                {item === 'Tech & Gear' && <Server size={14} className="text-blue-400" />}
                {item}
              </button>
            ))}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">{isMenuOpen ? <X size={28} /> : <Menu size={28} />}</button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-800 border-t border-slate-700 p-4 flex flex-col space-y-4 shadow-xl">
             {['Về Tôi', 'Kỹ Năng', 'Sản Phẩm', 'Tech & Gear', 'AI Studio', 'Liên Hệ'].map((item) => (
              <button key={item} onClick={() => scrollToSection(item === 'Sản Phẩm' ? 'portfolio' : item === 'Về Tôi' ? 'about' : item === 'Kỹ Năng' ? 'skills' : item === 'Tech & Gear' ? 'tech-gear' : item === 'AI Studio' ? 'ai-studio' : 'contact')} className="text-left hover:text-rose-400 py-2 border-b border-slate-700/50">{item}</button>
            ))}
          </div>
        )}
      </nav>

      <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
            <div className="inline-block px-4 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm font-medium tracking-wider mb-4">{data.personalInfo.role}</div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">Xin chào, tôi là <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-300">{data.personalInfo.fullName}</span></h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-lg mx-auto md:mx-0">{data.personalInfo.intro}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <button onClick={() => scrollToSection('portfolio')} className="px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-medium transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2">Xem Portfolio <ChevronRight size={18} /></button>
              <button onClick={() => scrollToSection('contact')} className="px-8 py-3 bg-transparent border border-slate-600 hover:border-slate-400 hover:bg-slate-800 text-slate-200 rounded-full font-medium transition-all">Liên Hệ Ngay</button>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center relative">
            <div className="relative w-64 h-64 md:w-96 md:h-96">
              <div className="absolute inset-0 border-2 border-slate-700 rounded-full animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute inset-4 border border-rose-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-slate-800 shadow-2xl">
                {/* ẢNH ĐẠI DIỆN LINH ĐỘNG - Load từ data.personalInfo.avatarUrl */}
                <img src={data.personalInfo.avatarUrl} alt="Portrait" className="w-full h-full object-cover"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-bold mb-4">Về Bản Thân</h2><div className="w-20 h-1 bg-rose-500 mx-auto rounded-full"></div><p className="mt-4 text-slate-400">Khám phá con người thật và giá trị tôi mang lại.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700/50 hover:border-rose-500/50 transition-all hover:transform hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors"><Star size={24} /></div>
              <h3 className="text-xl font-bold mb-3">Sở Trường</h3>
              <ul className="space-y-2 text-slate-400 text-sm">{data.about.strengths.map((s,i) => <li key={i} className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span> {s}</li>)}</ul>
            </div>
             <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700/50 hover:border-rose-500/50 transition-all hover:transform hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-400 mb-4 group-hover:bg-rose-500 group-hover:text-white transition-colors"><Heart size={24} /></div>
              <h3 className="text-xl font-bold mb-3">Sở Thích</h3>
              <ul className="space-y-2 text-slate-400 text-sm">{data.about.hobbies.map((s,i) => <li key={i} className="flex items-start gap-2"><span className="text-rose-400 mt-1">•</span> {s}</li>)}</ul>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700/50 hover:border-rose-500/50 transition-all hover:transform hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center text-green-400 mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors"><Target size={24} /></div>
              <h3 className="text-xl font-bold mb-3">Mục Tiêu</h3>
              <ul className="space-y-2 text-slate-400 text-sm">{data.about.goals.map((s,i) => <li key={i} className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span> {s}</li>)}</ul>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700/50 hover:border-rose-500/50 transition-all hover:transform hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-400 mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors"><AlertCircle size={24} /></div>
              <h3 className="text-xl font-bold mb-3">Góc "Thú Tội"</h3>
              <ul className="space-y-2 text-slate-400 text-sm">{data.about.weaknesses.map((s,i) => <li key={i} className="flex items-start gap-2"><span className="text-orange-400 mt-1">•</span> {s}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div><h2 className="text-3xl md:text-5xl font-bold mb-4">Sản Phẩm Của Tôi</h2><p className="text-slate-400 max-w-lg">Những dự án tôi đã thực hiện với vai trò Voice Talent, Presenter và Video Editor.</p></div>
            <div className="flex bg-slate-800 p-1 rounded-xl mt-6 md:mt-0">
              <button onClick={() => setActiveTab('voiceover')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'voiceover' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}><Mic size={16} /> Voice Over</button>
              <button onClick={() => setActiveTab('presenter')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'presenter' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}><Video size={16} /> Presenter</button>
              <button onClick={() => setActiveTab('editor')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'editor' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}><Scissors size={16} /> Editor</button>
            </div>
          </div>

          <div className="min-h-[400px]">
            
            {activeTab === 'voiceover' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                {data.portfolioData.voiceover.map((item) => (
                  <div key={item.id} className="bg-slate-800/50 rounded-2xl p-6 hover:bg-slate-800 transition-colors border border-slate-700/50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">{item.type}</span>
                        <h3 className="text-xl font-bold mt-1 text-white">{item.title}</h3>
                      </div>
                      <span className="text-xs font-mono bg-slate-900 px-2 py-1 rounded text-slate-400">{item.duration}</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-6">{item.desc}</p>
                    
                    {/* LOGIC MỚI: Tự động chọn Player dựa trên mediaType */}
                    <MediaPlayer 
                      type={item.mediaType || 'audio'} // Mặc định là audio nếu không ghi gì
                      src={item.fileUrl} 
                      poster={item.image} // Dùng cho video thumbnail
                    />
                  </div>
                ))}
              </div>
            )}

            {(activeTab === 'presenter' || activeTab === 'editor') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                {data.portfolioData[activeTab].map((item) => (
                  <div key={item.id} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 flex flex-col">
                    <div className="mb-4">
                      <span className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">{item.type}</span>
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                    </div>

                    {/* PLAYER THẬT */}
                    {/* fileUrl là đường dẫn video (/data/video.mp4), image là thumbnail */}
                    <MediaPlayer type="video" src={item.fileUrl} poster={item.image} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="tech-gear" className="py-20 bg-slate-900 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16"><h2 className="text-3xl md:text-5xl font-bold mb-4">Tech & Studio Gear</h2><div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div><p className="mt-4 text-slate-400 max-w-2xl mx-auto">Ngoài nghệ thuật, tôi là một người đam mê công nghệ. Đây là "đồ chơi" trong <strong>Home Lab</strong> và <strong>Studio</strong> của tôi.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.techPassions.map((tech) => (
              <div key={tech.id} className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all group hover:bg-slate-800">
                <div className={`w-14 h-14 ${tech.bg} rounded-xl flex items-center justify-center ${tech.color} mb-6 group-hover:scale-110 transition-transform`}>
                  {iconMap[tech.iconName]}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-100">{tech.title}</h3><p className="text-slate-400 text-sm leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="py-12 bg-rose-500 text-white overflow-hidden">
        <div className="container mx-auto px-6 mb-4 text-center"><h3 className="font-bold text-xl uppercase tracking-widest opacity-80">Bộ Công Cụ Sáng Tạo</h3></div>
        <div className="flex gap-12 justify-center flex-wrap opacity-90 text-lg font-bold">
            {data.skills.map((skill, index) => <React.Fragment key={index}><span>{skill}</span><span>•</span></React.Fragment>)}
        </div>
      </section>

      <section id="ai-studio" className="py-20 bg-gradient-to-br from-indigo-900 to-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"><div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div><div className="absolute bottom-10 right-10 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl"></div></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12"><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-purple-500/50 text-purple-300 text-sm font-bold mb-4"><Sparkles size={16} /> POWERED BY GEMINI AI</div><h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Trợ Lý Kịch Bản AI ✨</h2><p className="text-slate-400 max-w-2xl mx-auto">Trải nghiệm công nghệ AI để tối ưu hóa kịch bản và nhận chỉ đạo diễn xuất (Voice Direction) ngay lập tức. Nhập ý tưởng thô của bạn, tôi sẽ giúp bạn biến nó thành tác phẩm.</p></div>
          <div className="max-w-4xl mx-auto bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-700 flex flex-col">
              <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-rose-400"><Bot size={24} /></div><h3 className="font-bold text-lg">Nhập Ý Tưởng / Kịch Bản Thô</h3></div>
              <textarea className="flex-1 w-full bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all resize-none mb-4 min-h-[200px]" placeholder="Ví dụ: Tôi muốn làm một video giới thiệu về quán cà phê phong cách vintage, nhạc nhẹ nhàng, hướng tới giới trẻ..." value={aiInput} onChange={(e) => setAiInput(e.target.value)}></textarea>
              <button onClick={handleAiGenerate} disabled={isAiLoading || !aiInput.trim()} className="w-full py-3 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group">{isAiLoading ? (<><Loader size={20} className="animate-spin" /> Đang Phân Tích...</>) : (<><Wand2 size={20} className="group-hover:rotate-12 transition-transform" /> ✨ Phân Tích & Tối Ưu</>)}</button>
            </div>
            <div className="w-full md:w-1/2 p-6 md:p-8 bg-slate-900/50 flex flex-col">
               <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-green-400"><Sparkles size={24} /></div><h3 className="font-bold text-lg">Kết Quả Phân Tích</h3></div>
              <div className="flex-1 bg-slate-800/50 rounded-xl border border-slate-700 p-4 overflow-y-auto max-h-[400px]">
                {aiError && (<div className="text-rose-400 flex items-center gap-2"><AlertCircle size={18} /> {aiError}</div>)}
                {!aiResult && !isAiLoading && !aiError && (<div className="h-full flex flex-col items-center justify-center text-slate-500 text-center opacity-60"><Bot size={48} className="mb-4" /><p>Kết quả sẽ hiển thị tại đây...</p></div>)}
                {isAiLoading && (<div className="space-y-4 animate-pulse"><div className="h-4 bg-slate-700 rounded w-3/4"></div><div className="h-4 bg-slate-700 rounded w-full"></div><div className="h-4 bg-slate-700 rounded w-5/6"></div><div className="h-20 bg-slate-700 rounded w-full mt-4"></div></div>)}
                {aiResult && (<div className="prose prose-invert prose-sm max-w-none whitespace-pre-line text-slate-300">{aiResult}</div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-slate-800 rounded-3xl p-8 md:p-12 border border-slate-700 shadow-2xl">
            <div className="text-center mb-10"><h2 className="text-3xl font-bold mb-4">Sẵn Sàng Hợp Tác?</h2><p className="text-slate-400">Hãy để lại lời nhắn nếu bạn đang tìm kiếm một giọng đọc, một MC hay một editor cho dự án sắp tới.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4"><div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-rose-500"><Mail size={20} /></div><div><p className="text-sm text-slate-400">Email</p><p className="font-medium">{data.personalInfo.contact.email}</p></div></div>
                <div className="flex items-center gap-4"><div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-rose-500"><Phone size={20} /></div><div><p className="text-sm text-slate-400">Hotline / Zalo</p><p className="font-medium">{data.personalInfo.contact.phone}</p></div></div>
                <div className="pt-6"><p className="text-sm text-slate-400 mb-4">Mạng Xã Hội</p><div className="flex gap-4"><a href={data.personalInfo.socials.facebook} className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><Facebook size={18} /></a><a href={data.personalInfo.socials.linkedin} className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><Linkedin size={18} /></a><a href={data.personalInfo.socials.youtube} className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><Youtube size={18} /></a><a href={data.personalInfo.socials.instagram} className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><Instagram size={18} /></a></div></div>
              </div>
              <form id="contact-form" action={`https://formspree.io/f/${data.personalInfo.contact.formspreeId}`} method="POST" className="space-y-4">
                <div><input type="text" id="name" name="name" required placeholder="Tên của bạn" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-rose-500 transition-colors text-white" /></div>
                <div><input type="email" id="email" name="email" required placeholder="Email liên hệ" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-rose-500 transition-colors text-white" /></div>
                <div><textarea id="message" name="message" rows="4" required placeholder="Nội dung công việc..." className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-rose-500 transition-colors text-white"></textarea></div>
                <button type="submit" id="submit-btn" className="w-full bg-gradient-to-r from-rose-500 to-orange-400 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"><span>Gửi tin nhắn</span><i class="fa-regular fa-paper-plane"></i></button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-slate-900 border-t border-slate-800 text-center text-slate-500 text-sm"><p>© 2025 {data.personalInfo.brandName}. All rights reserved.</p></footer>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }`}</style>
    </div>
  );
};

export default App;
