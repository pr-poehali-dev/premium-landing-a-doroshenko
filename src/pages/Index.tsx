import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const PHOTO_HERO = 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/f8023fbe-5972-4d0a-9de8-975b411fa0fa.jpg';
const PHOTO_ABOUT_1 = 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/9a18b6be-471b-434f-83ca-c4a47dd3ed78.png';
const PHOTO_ABOUT_2 = 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/e3383e45-4b36-41f0-8304-8f1de0901248.png';
const LOGO = 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/147040bb-39b2-46b1-af51-38358912e677.png';

type FormState = { name: string; niche: string; phone: string };
const EMPTY_FORM: FormState = { name: '', niche: '', phone: '' };

const GAMES = [
  { emoji: '🎲', title: '«Город продаж»', text: 'Команда реально играет в продажи: ищет клиентов, торгуется, закрывает сделки — или сливает их.' },
  { emoji: '🎩', title: '«6 шляп»', text: 'Игра про мышление и взаимодействие в команде. Кто тут капитан, а кто спит на весле.' },
];

const PRODUCTS = [
  {
    emoji: '🎲',
    title: 'Игровой день для отдела продаж',
    price: '30 000 ₽',
    meta: '1 день · 4–8 человек · Санкт-Петербург / выезд',
    text: '«Город продаж» и «6 шляп» — команда играет, спорит, продаёт и в итоге понимает про себя гораздо больше, чем после любого тренинга.',
    cta: 'ПОИГРАТЬ С ОТДЕЛОМ',
    preset: 'Игровой день для отдела продаж',
  },
  {
    emoji: '🧠',
    title: 'Стратегическая сессия',
    price: '50 000 ₽',
    meta: '1 день',
    text: 'Берём реальный вопрос бизнеса → обсуждаем → спорим → принимаем решения. Без длинного консалтинга.',
    cta: 'ПРОВЕСТИ СЕССИЮ',
    preset: 'Стратегическая сессия',
  },
];

const ABOUT_TAGS = ['Продажи', 'Маркетинг', 'Продукты', 'B2B', 'Производство', 'E-commerce'];

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

async function sendLead(form: FormState, type: string) {
  try {
    const res = await fetch('https://functions.poehali.dev/fc323d06-bbf9-4e34-b478-9a1d63552d0d', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, phone: form.phone, niche: form.niche, type }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function LeadFields({ form, setForm }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>> }) {
  return (
    <>
      <input className="input-dark rounded-sm px-4 py-3 text-sm w-full" placeholder="Имя *" required
        value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
      <input className="input-dark rounded-sm px-4 py-3 text-sm w-full" placeholder="Компания (необязательно)"
        value={form.niche} onChange={e => setForm(p => ({ ...p, niche: e.target.value }))} />
      <input className="input-dark rounded-sm px-4 py-3 text-sm w-full" placeholder="Телефон / Telegram *" required
        value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
    </>
  );
}

function Modal({ open, onClose, presetTitle }: { open: boolean; onClose: () => void; presetTitle?: string }) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await sendLead(form, presetTitle || 'header');
    setSent(true);
    setLoading(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-md"
        style={{ background: '#0e0e0e', border: '1px solid rgba(201,169,110,0.35)', borderRadius: 2 }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
          <Icon name="X" size={20} />
        </button>
        {sent ? (
          <div className="p-10 text-center">
            <div className="text-5xl mb-4">🤝</div>
            <p className="font-cormorant text-2xl gold-text mb-2">Заявка принята</p>
            <p className="text-white/60 font-golos text-sm">Андрей напишет вам лично в ближайшее время</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
            <h3 className="font-cormorant text-2xl text-off-white mb-1">
              {presetTitle ? presetTitle : 'Погнали?'}
            </h3>
            <p className="text-white/50 text-sm font-golos mb-2">
              Оставьте контакты — обсудим детали и подберём формат
            </p>
            <LeadFields form={form} setForm={setForm} />
            <button type="submit" disabled={loading} className="btn-gold rounded py-3 text-sm mt-2 disabled:opacity-60">
              {loading ? 'Отправляем...' : 'Отправить'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await sendLead(form, 'bottom');
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-4">🤝</div>
        <p className="font-cormorant text-2xl gold-text mb-2">Заявка принята</p>
        <p className="text-white/50 text-sm">Андрей напишет вам лично в ближайшее время</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
      <LeadFields form={form} setForm={setForm} />
      <div className="md:col-span-3">
        <button type="submit" disabled={loading}
          className="btn-gold rounded-sm py-4 px-12 text-sm tracking-wider uppercase disabled:opacity-60">
          {loading ? 'Отправляем...' : 'Погнали'}
        </button>
      </div>
    </form>
  );
}

export default function Index() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPreset, setModalPreset] = useState<string | undefined>(undefined);
  const [photoIdx, setPhotoIdx] = useState(0);

  const openModal = (preset?: string) => {
    setModalPreset(preset);
    setModalOpen(true);
  };

  const hero = useInView(0.05);
  const intro = useInView(0.1);
  const products = useInView(0.1);
  const about = useInView(0.1);
  const contact = useInView(0.1);

  useEffect(() => {
    const interval = setInterval(() => setPhotoIdx(i => (i + 1) % 2), 5000);
    return () => clearInterval(interval);
  }, []);

  const aboutPhotos = [PHOTO_ABOUT_1, PHOTO_ABOUT_2];

  return (
    <div className="min-h-screen bg-obsidian text-off-white font-golos overflow-x-hidden">
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} presetTitle={modalPreset} />

      {/* ШАПКА */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-4"
        style={{ background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
        <div className="flex flex-col items-center gap-1 whitespace-nowrap">
          <img src={LOGO} alt="Бизнес-игры by Doroshenko" className="h-14 w-14 md:h-16 md:w-16 rounded-full object-cover" />
          <span className="font-cormorant text-lg md:text-xl tracking-widest uppercase gold-text hidden sm:inline">
            ДОРОШЕНКО
          </span>
        </div>
        <nav className="hidden lg:flex gap-6 text-xs text-white/40 tracking-widest uppercase">
          <a href="#games" className="hover:text-white transition-colors">Игры</a>
          <a href="#about" className="hover:text-white transition-colors">Обо мне</a>
          <a href="#contact" className="hover:text-white transition-colors">Контакты</a>
        </nav>
        <button onClick={() => openModal()}
          className="text-xs tracking-widest uppercase gold-text hover:opacity-70 transition-opacity border border-gold/30 px-4 py-2 hidden md:block">
          Погнали
        </button>
        <a href="tel:89206200034" className="text-sm gold-text hover:opacity-80 transition-opacity font-medium md:hidden">
          8 920 620-00-34
        </a>
      </header>

      {/* HERO */}
      <section ref={hero.ref} className="relative min-h-screen flex items-stretch overflow-hidden pt-16">
        <div className="relative z-10 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20 w-full md:w-1/2">
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(201,169,110,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.025) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
          <div className="relative z-10 max-w-xl">
            <p className={`text-xs tracking-[0.3em] uppercase text-gold/70 mb-8 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.1s' }}>
              🎲 Игры для отделов продаж
            </p>

            <h1 className={`font-cormorant font-light leading-[1.05] mb-6 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ fontSize: 'clamp(2.1rem, 4.6vw, 4rem)', transitionDelay: '0.2s' }}>
              Учебники для тех,<br />кто не хочет<br />
              <span className="gold-gradient">учить учебники</span>
            </h1>

            <p className={`text-white/75 text-[15px] md:text-lg leading-relaxed mb-4 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '0.28s' }}>
              Мы слишком усложнили игру под названием «бизнес».<br />
              Здесь возвращаем бизнесу игру.
            </p>

            <p className={`text-white/65 text-[15px] md:text-lg leading-relaxed mb-10 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '0.3s' }}>
              Не лекция. Не скучный тренинг. Не корпоратив с конкурсами.<br />
              Играем в продажи.
            </p>

            <div className={`flex flex-col sm:flex-row gap-4 mb-6 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.5s' }}>
              <button onClick={() => openModal('Игровой день для отдела продаж')} className="btn-gold px-8 py-4 text-sm tracking-wider uppercase rounded-sm">
                Поиграть с отделом
              </button>
            </div>

            <p className={`text-white/30 text-xs tracking-wide transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.6s' }}>
              Санкт-Петербург, метро Маяковская, ТЦ «Невский Атриум» — выезд Москва, остальные регионы по договорённости
            </p>
          </div>
        </div>

        <div className="hidden md:block absolute right-0 top-16 bottom-0 w-1/2">
          <div className="absolute inset-0 z-10" style={{
            background: 'linear-gradient(to right, #0A0A0A 0%, transparent 35%)'
          }} />
          <img src={PHOTO_HERO} alt="Андрей Дорошенко"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.85) contrast(1.05)', objectPosition: 'top' }} />
          <div className="absolute inset-0 z-10" style={{
            background: 'linear-gradient(to top, #0A0A0A 0%, transparent 40%)'
          }} />
        </div>
      </section>

      {/* ИНТРО / КАК ЭТО РАБОТАЕТ */}
      <section id="games" ref={intro.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className={`transition-all duration-700 ${intro.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h2 className="font-cormorant text-3xl md:text-5xl text-off-white font-light mb-6">
              Люди ищут клиентов, продают,<br />конкурируют, ошибаются и смеются
            </h2>
            <p className="text-white/60 text-[15px] md:text-lg leading-relaxed max-w-xl mx-auto">
              Через игру становится понятнее, кому, что и зачем мы продаём — и как вообще устроен процесс продажи.
            </p>

            <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-sm tracking-wide rounded-sm border border-gold/30 gold-text hover:bg-gold/10 transition-colors">
              <Icon name="Send" size={16} />
              Подписаться на телеграм-канал «Дорошенко — бизнес-игры»
            </a>
          </div>

          <div className={`grid sm:grid-cols-2 gap-4 mt-14 transition-all duration-700 ${intro.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '0.15s' }}>
            {GAMES.map((g, i) => (
              <div key={i} className="p-7 rounded-sm text-left"
                style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.14)' }}>
                <div className="text-3xl mb-3">{g.emoji}</div>
                <p className="font-cormorant text-2xl gold-text mb-2">{g.title}</p>
                <p className="text-white/60 text-sm leading-relaxed">{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ПРОДУКТЫ */}
      <section id="products" ref={products.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-14 transition-all duration-700 ${products.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Форматы
            </h2>
            <div className="section-divider mt-6" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {PRODUCTS.map((p, i) => (
              <div key={i}
                className={`p-8 rounded-sm flex flex-col transition-all duration-700 ${products.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.16)', transitionDelay: `${0.1 + i * 0.1}s` }}>
                <div className="text-4xl mb-4">{p.emoji}</div>
                <p className="text-off-white font-medium text-lg mb-2 leading-snug">{p.title}</p>
                <p className="font-cormorant text-3xl gold-text font-semibold mb-3">{p.price}</p>
                <p className="text-xs tracking-widest uppercase text-white/30 mb-5">{p.meta}</p>
                <p className="text-white/65 text-sm leading-relaxed mb-8 flex-1">{p.text}</p>
                <button onClick={() => openModal(p.preset)}
                  className="btn-gold px-6 py-4 text-sm tracking-wider uppercase rounded-sm">
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ОБО МНЕ */}
      <section id="about" ref={about.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className={`transition-all duration-700 ${about.inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
              style={{ transitionDelay: '0.1s' }}>
              <div className="relative">
                <div className="aspect-[3/4] max-w-sm rounded-sm overflow-hidden relative"
                  style={{ border: '1px solid rgba(201,169,110,0.2)' }}>
                  {aboutPhotos.map((src, i) => (
                    <img key={i} src={src} alt="Андрей Дорошенко"
                      className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000"
                      style={{ opacity: photoIdx === i ? 1 : 0 }} />
                  ))}
                </div>
                <div className="flex gap-2 mt-5">
                  {aboutPhotos.map((_, i) => (
                    <button key={i} onClick={() => setPhotoIdx(i)}
                      className="h-px transition-all duration-300"
                      style={{ width: 24, background: photoIdx === i ? '#C9A96E' : 'rgba(201,169,110,0.25)' }} />
                  ))}
                </div>
              </div>
            </div>

            <div className={`transition-all duration-700 ${about.inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
              style={{ transitionDelay: '0.2s' }}>
              <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Обо мне</p>
              <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light mb-6">
                Андрей Дорошенко
              </h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {ABOUT_TAGS.map((t, i) => (
                  <span key={i} className="text-xs tracking-wide px-3 py-1.5 rounded-sm text-white/60"
                    style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}>
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-white/70 text-lg leading-relaxed mb-4">
                Придумываю игры, которые помогают понять продажи не через учебник, а через действие.
              </p>
              <p className="text-white/50 text-[15px] leading-relaxed">
                Я умею строить отделы продаж, настраивать CRM и говорить про стратегии. Просто сейчас мне гораздо интереснее и полезнее делать и вести игры.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section id="contact" ref={contact.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <div className={`text-center mb-14 transition-all duration-700 ${contact.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Погнали?
            </h2>
            <div className="section-divider mt-6" />
            <p className="text-white/50 text-[15px] leading-relaxed mt-6">
              Напишите мне. Расскажу, что за игра и как это происходит.
            </p>
          </div>

          <div className={`transition-all duration-700 mb-14 ${contact.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '0.15s' }}>
            <ContactForm />
          </div>

          <div className={`flex flex-wrap items-center justify-center gap-x-8 gap-y-4 transition-all duration-700 ${contact.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '0.3s' }}>
            <a href="tel:89206200034" className="flex items-center gap-2 gold-text hover:opacity-70 transition-opacity">
              <Icon name="Phone" size={15} className="text-gold/60" />
              <span className="font-cormorant text-xl">+7 (920) 620-00-34</span>
            </a>
            <a href="mailto:and-doroshe@mail.ru" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
              <Icon name="Mail" size={15} className="text-white/30" />
              <span className="text-sm">and-doroshe@mail.ru</span>
            </a>
            <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/50 hover:text-gold transition-colors">
              <Icon name="Send" size={15} className="text-white/30" />
              <span className="text-sm">@adprodmarketing</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: '#060606' }} className="py-8 px-6 md:px-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="font-cormorant text-lg gold-text">Андрей Дорошенко</p>
            <p className="text-white/25 text-xs mt-1">Игры для отделов продаж</p>
          </div>
          <div className="flex gap-4">
            <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer"
              className="text-white/25 hover:text-gold transition-colors">
              <Icon name="Send" size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}