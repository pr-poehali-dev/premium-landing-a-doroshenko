import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PHOTO_HERO = 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/769d8997-96cd-415d-8802-959202bb8ee0.png';
const PHOTO_ABOUT_1 = 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/9a18b6be-471b-434f-83ca-c4a47dd3ed78.png';
const PHOTO_ABOUT_2 = 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/e3383e45-4b36-41f0-8304-8f1de0901248.png';
const DIPLOMA_URL = 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/250ca44b-7532-4a19-b907-5442a6964236.jpg';

const REVENUE_OPTIONS = ['До 30 млн', '30–300 млн', 'Более 300 млн'];

type FormState = { name: string; niche: string; revenue: string; phone: string };
const EMPTY_FORM: FormState = { name: '', niche: '', revenue: '', phone: '' };

const SHIELD_CARDS = [
  {
    icon: 'ShieldAlert',
    title: 'Главный риск директора — это бездействие',
    text: 'Если компания идет ко дну, а вы сидели сложив руки — ФНС и кредиторы перешьют все долги ООО на вас лично. Долги по субсидиарке и ФНС не списываются никогда, даже через личное банкротство.',
  },
  {
    icon: 'Wrench',
    title: 'Внешний антикризисный эксперт',
    text: 'Чтобы спасти бизнес, нужен независимый, «незамыленный» взгляд B2B-архитектора со стороны. В 90% предбанкротных компаний корень кризиса кроется в развале связки Продукт ➡️ Трафик ➡️ Продажи.',
  },
];

const CRITERIA = [
  { icon: 'Factory', title: 'Профиль', text: 'Малые и средние производственные компании и сложные B2B-услуги.' },
  { icon: 'TrendingUp', title: 'Масштаб бизнеса', text: 'Годовой оборот от 30 млн до 300 млн рублей.' },
  { icon: 'Users', title: 'Инфраструктура', text: 'Наличие действующего (или просевшего) отдела продаж и накопленной клиентской базы.' },
  { icon: 'Target', title: 'Цель собственника', text: 'Сохранить производство и пересобрать бизнес, а не искать «черные» схемы.' },
];

const AUDIT_ESSENCE = [
  { icon: 'Search', title: 'Аудит вашего Продукта', text: 'Анализ юнит-экономики, реальной ценности, прайс-листов и точек, где тихо утекает маржа.' },
  { icon: 'Swords', title: 'Аудит Продуктов Конкурентов', text: 'Сравнительный препаринг рынка глазами покупателя. Почему выбирают их, а не вас?' },
  { icon: 'Radio', title: 'Разбор Системы Маркетинга (Трафика)', text: 'Анализ каналов привлечения, сквозной аналитики и качества лидов. Почему маркетинг сливает бюджет, а приводит не тех клиентов?' },
  { icon: 'Settings', title: 'Аудит Отдела Продаж и Сервиса', text: 'Оценка опрятности коммуникации, проверка воронки CRM, выявление саботажа менеджеров и узких мест в сделках.' },
];

const EXPERIENCE = [
  { icon: 'Factory', name: 'ООО «Великодворский стеклотарный завод»', sector: 'Промышленность', text: 'Оценка коммерческих процессов, аудит воронки B2B-продаж и работа со сложными контрактами.' },
  { icon: 'Package', name: '«ПромСиз»', sector: 'Декорирование стеклоизделий', text: 'Оптимизация коммерческого блока и анализ конкурентоспособности продуктов.' },
  { icon: 'Coffee', name: '«Территория Обжарки»', sector: 'Производство и B2B-поставки кофе', text: 'Пересборка маркетинга, настройка B2B-сервиса и оптимизация прайс-листов.' },
  { icon: 'Cookie', name: 'Сеть пекарен «Добрые Булки»', sector: 'Сетевой пищевой ритейл', text: 'Настройка стандартов управления, оцифровка показателей и контроль операционных процессов.' },
];

const PRICES = [
  {
    tier: '01',
    title: 'Комплексный Экспресс-Аудит Жизнеспособности',
    duration: '3–5 дней · включая 2 стратегические сессии',
    price: '150 000 ₽',
    description: 'Аудит продукта, конкурентов, маркетинга, воронки ОП + проверка юридических/налоговых рисков.',
    result: 'Архитектурный чертеж реанимации бизнеса + доказательный щит от субсидиарной ответственности.',
    cta: 'Заказать Экспресс-Аудит',
    highlight: true,
  },
  {
    tier: '02',
    title: 'Архитектурный надзор (Контроль)',
    duration: 'Еженедельное экспертное сопровождение',
    price: 'от 100 000 до 150 000 ₽ / мес',
    description: 'Проект внедряет ваша команда. Я бью по рукам за отклонения, контролирую качество и веду компанию по чертежу.',
    cta: 'Выбрать Архитектурный надзор',
  },
  {
    tier: '03',
    title: 'Генеральный подряд (Система под ключ)',
    duration: 'Полное управление пересборкой',
    price: 'от 450 000 ₽ за проект',
    description: 'Привлекаю свою проверенную распределенную команду (дизайнеры, CRM-технари, трафик) и сдаю готовый коммерческий конвейер.',
    cta: 'Запросить расчет под ключ',
  },
];

const CITIES = ['Санкт-Петербург', 'Москва', 'Владимир', 'Нижний Новгород', 'Иваново', 'Рязань', 'Ярославль'];

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
      body: JSON.stringify({ name: form.name, phone: form.phone, niche: form.niche, revenue: form.revenue, type }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function LeadFields({ form, setForm }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>> }) {
  return (
    <>
      <input className="input-dark rounded-sm px-4 py-3 text-sm w-full" placeholder="Имя ЛПР *" required
        value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
      <input className="input-dark rounded-sm px-4 py-3 text-sm w-full" placeholder="Ссылка на сайт / Ниша"
        value={form.niche} onChange={e => setForm(p => ({ ...p, niche: e.target.value }))} />
      <Select value={form.revenue} onValueChange={v => setForm(p => ({ ...p, revenue: v }))}>
        <SelectTrigger className="input-dark rounded-sm px-4 py-3 h-auto text-sm w-full">
          <SelectValue placeholder="Годовой оборот компании" />
        </SelectTrigger>
        <SelectContent>
          {REVENUE_OPTIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
        </SelectContent>
      </Select>
      <input className="input-dark rounded-sm px-4 py-3 text-sm w-full" placeholder="Телефон / Telegram *" required
        value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
    </>
  );
}

function Modal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await sendLead(form, 'header');
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
            <div className="text-5xl mb-4">✓</div>
            <p className="font-cormorant text-2xl gold-text mb-2">Заявка принята</p>
            <p className="text-white/60 font-golos text-sm">Андрей свяжется с вами лично в ближайшее время</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
            <h3 className="font-cormorant text-2xl text-off-white mb-1">Zoom-диагностика</h3>
            <p className="text-white/50 text-sm font-golos mb-2">Андрей лично свяжется с вами и согласует время</p>
            <LeadFields form={form} setForm={setForm} />
            <button type="submit" disabled={loading} className="btn-gold rounded py-3 text-sm mt-2 disabled:opacity-60">
              {loading ? 'Отправляем...' : 'Записаться на Zoom-диагностику'}
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
        <div className="text-4xl mb-4">✓</div>
        <p className="font-cormorant text-2xl gold-text mb-2">Заявка принята</p>
        <p className="text-white/50 text-sm">Андрей свяжется с вами лично в ближайшее время</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
      <LeadFields form={form} setForm={setForm} />
      <div className="md:col-span-2">
        <button type="submit" disabled={loading}
          className="btn-gold rounded-sm py-4 px-12 text-sm tracking-wider uppercase disabled:opacity-60">
          {loading ? 'Отправляем...' : 'Отправить запрос Архитектору'}
        </button>
      </div>
    </form>
  );
}

export default function Index() {
  const [modalOpen, setModalOpen] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);

  const hero = useInView(0.05);
  const shield = useInView(0.1);
  const criteria = useInView(0.1);
  const essence = useInView(0.1);
  const experience = useInView(0.1);
  const result = useInView(0.1);
  const prices = useInView(0.1);
  const about = useInView(0.1);
  const telegram = useInView(0.1);
  const contact = useInView(0.1);

  useEffect(() => {
    const interval = setInterval(() => setPhotoIdx(i => (i + 1) % 2), 5000);
    return () => clearInterval(interval);
  }, []);

  const aboutPhotos = [PHOTO_ABOUT_1, PHOTO_ABOUT_2];

  return (
    <div className="min-h-screen bg-obsidian text-off-white font-golos overflow-x-hidden">
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-4"
        style={{ background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
        <div className="font-cormorant text-base md:text-lg tracking-widest uppercase gold-text whitespace-nowrap">
          А. ДОРОШЕНКО <span className="text-white/30 hidden md:inline">// B2B-Архитектура</span>
        </div>
        <nav className="hidden lg:flex gap-6 text-xs text-white/40 tracking-widest uppercase">
          <a href="#criteria" className="hover:text-white transition-colors">Критерии</a>
          <a href="#shield" className="hover:text-white transition-colors">Защита от субсидиарки</a>
          <a href="#essence" className="hover:text-white transition-colors">Суть аудита</a>
          <a href="#experience" className="hover:text-white transition-colors">Опыт</a>
          <a href="#prices" className="hover:text-white transition-colors">Стоимость</a>
          <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">Telegram</a>
        </nav>
        <button onClick={() => setModalOpen(true)}
          className="text-xs tracking-widest uppercase gold-text hover:opacity-70 transition-opacity border border-gold/30 px-4 py-2 hidden md:block">
          Zoom-диагностика
        </button>
        <a href="tel:89206200034" className="text-sm gold-text hover:opacity-80 transition-opacity font-medium md:hidden">
          8 920 620-00-34
        </a>
      </header>

      {/* БЛОК 1 — HERO */}
      <section ref={hero.ref} className="relative min-h-screen flex items-stretch overflow-hidden pt-16">
        <div className="relative z-10 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20 w-full md:w-1/2">
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(201,169,110,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.025) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
          <div className="relative z-10 max-w-xl">
            <p className={`text-xs tracking-[0.3em] uppercase text-gold/70 mb-8 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.1s' }}>
              Дипломированный арбитражный управляющий · B2B-архитектор
            </p>

            <h1 className={`font-cormorant font-light leading-[1.1] mb-8 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ fontSize: 'clamp(1.9rem, 4.2vw, 3.6rem)', transitionDelay: '0.2s' }}>
              Антикризисный аудит и пересборка<br />
              <span className="gold-gradient">коммерческого мотора предприятия</span>
            </h1>

            <p className={`text-white/65 text-[15px] md:text-base leading-relaxed mb-8 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '0.3s' }}>
              Авторская оценка жизнеспособности бизнеса и синхронизация связки: Продукт ➡️ Трафик ➡️ Продажи. Сохраняю производства, активы и рабочие места.
            </p>

            <div className={`mb-10 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '0.4s' }}>
              <div className="pl-5 border-l border-gold/40">
                <p className="text-gold/80 text-sm leading-relaxed">
                  Опережая реформу банкротного законодательства: реанимация и рост бизнеса вместо ликвидации.
                </p>
              </div>
            </div>

            <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.5s' }}>
              <button onClick={() => setModalOpen(true)} className="btn-gold px-8 py-4 text-sm tracking-wider uppercase rounded-sm">
                Записаться на Zoom-диагностику
              </button>
              <a href="#prices" className="flex items-center justify-center gap-2 px-6 py-4 text-sm tracking-wide text-white/50 hover:text-white transition-colors border border-white/10 rounded-sm hover:border-white/20">
                Форматы и цены
                <Icon name="ArrowDown" size={15} />
              </a>
            </div>
          </div>
        </div>

        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/2">
          <div className="absolute inset-0 z-10" style={{
            background: 'linear-gradient(to right, #0A0A0A 0%, transparent 35%)'
          }} />
          <img src={PHOTO_HERO} alt="Андрей Дорошенко"
            className="w-full h-full object-cover object-top"
            style={{ filter: 'brightness(0.85) contrast(1.05)' }} />
          <div className="absolute inset-0 z-10" style={{
            background: 'linear-gradient(to top, #0A0A0A 0%, transparent 40%)'
          }} />
        </div>

        <div className="absolute bottom-8 left-6 md:left-16 flex flex-col items-start gap-2 z-10">
          <div className="w-px h-14 bg-gradient-to-b from-transparent to-gold/30" />
        </div>
      </section>

      {/* БЛОК 2 — ЮРИДИЧЕСКИЙ ЩИТ */}
      <section id="shield" ref={shield.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className={`mb-14 transition-all duration-700 ${shield.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Юридический щит</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Как законно защитить личное имущество<br />от субсидиарной ответственности?
            </h2>
            <div className="section-divider mt-6" />
            <p className="text-white/50 text-[15px] leading-relaxed mt-6 max-w-2xl mx-auto">
              Главный аргумент для ФНС, банков и судов — это доказанный факт того, что руководитель предпринял все разумные усилия для сохранения производства.
            </p>
          </div>

          <div className="space-y-5">
            {SHIELD_CARDS.map((card, i) => (
              <div key={i}
                className={`p-7 rounded-sm transition-all duration-700 ${shield.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.15)', transitionDelay: `${0.1 + i * 0.1}s` }}>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-sm flex items-center justify-center"
                    style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.25)' }}>
                    <Icon name={card.icon} fallback="Star" size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-off-white font-medium text-[15px] mb-2">{card.title}</p>
                    <p className="text-white/70 text-[15px] leading-relaxed">{card.text}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className={`p-7 rounded-sm transition-all duration-700 ${shield.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ background: 'rgba(201,169,110,0.07)', border: '1px solid rgba(201,169,110,0.25)', transitionDelay: '0.3s' }}>
              <div className="flex items-start gap-4 mb-5">
                <div className="shrink-0 w-10 h-10 rounded-sm flex items-center justify-center"
                  style={{ background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.3)' }}>
                  <Icon name="Scale" size={18} className="text-gold" />
                </div>
                <p className="text-off-white font-medium text-[15px] mt-2">Двухвекторная защита ваших интересов</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 pl-0 md:pl-14">
                <div className="p-5 rounded-sm" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-xs tracking-widest uppercase text-gold/70 mb-2">Сценарий «Рост»</p>
                  <p className="text-white/70 text-sm leading-relaxed">Мы находим точки утечки маржи, пересобираем ОП и маркетинг, вытаскиваем бизнес из кассового разрыва и сохраняем рабочие места.</p>
                </div>
                <div className="p-5 rounded-sm" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-xs tracking-widest uppercase text-gold/70 mb-2">Сценарий «Щит»</p>
                  <p className="text-white/70 text-sm leading-relaxed">Если реанимация бессмысленна, официальный аудит и внедряемый План оздоровления служат в суде прямым доказательством вашей добросовестности, снимая личные финансовые риски с руководителя.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* БЛОК 3 — ФИЛЬТР КЛИЕНТОВ */}
      <section id="criteria" ref={criteria.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <div className={`mb-14 transition-all duration-700 ${criteria.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Квалификация</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              С кем я работаю
            </h2>
            <div className="section-divider mt-6" />
            <p className="text-white/50 text-[15px] leading-relaxed mt-6 max-w-2xl mx-auto">
              Я захожу на предприятия строго при наличии следующих критериев:
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {CRITERIA.map((item, i) => (
              <div key={i}
                className={`flex items-start gap-4 p-6 rounded-sm transition-all duration-700 ${criteria.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.12)', transitionDelay: `${0.1 + i * 0.1}s` }}>
                <div className="shrink-0 w-9 h-9 rounded-sm flex items-center justify-center"
                  style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)' }}>
                  <Icon name={item.icon} fallback="Check" size={16} className="text-gold" />
                </div>
                <div>
                  <p className="text-off-white font-medium text-sm mb-1">{item.title}</p>
                  <p className="text-white/60 text-[15px] leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* БЛОК 4 — СУТЬ АУДИТА */}
      <section id="essence" ref={essence.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className={`mb-16 transition-all duration-700 ${essence.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Методология</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Мой аудит — это не банальная<br />
              <span className="gold-gradient">прослушка звонков</span>
            </h2>
            <div className="section-divider mt-6" />
            <p className="text-white/50 text-[15px] leading-relaxed mt-6 max-w-2xl mx-auto">
              Это глубокая инженерная препаровка коммерческого блока по 4 ключевым направлениям:
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {AUDIT_ESSENCE.map((step, i) => (
              <div key={i}
                className={`p-7 rounded-sm transition-all duration-700 ${essence.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ background: 'rgba(201,169,110,0.03)', border: '1px solid rgba(201,169,110,0.1)', transitionDelay: `${0.1 + i * 0.08}s` }}>
                <div className="w-10 h-10 rounded-sm flex items-center justify-center mb-5"
                  style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)' }}>
                  <Icon name={step.icon} fallback="Star" size={18} className="text-gold" />
                </div>
                <p className="text-off-white font-medium text-sm mb-2">{step.title}</p>
                <p className="text-white/50 text-sm leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* БЛОК 5 — ОПЫТ */}
      <section id="experience" ref={experience.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className={`mb-14 transition-all duration-700 ${experience.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Подтвержденный опыт</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Опыт работы с реальным сектором:<br />от сетевого ритейла до стеклотарных заводов
            </h2>
            <div className="section-divider mt-6" />
            <p className="text-white/50 text-[15px] leading-relaxed mt-6 max-w-2xl mx-auto">
              Адаптирую коммерческую архитектуру под особенности конкретной отрасли.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {EXPERIENCE.map((item, i) => (
              <div key={i}
                className={`p-7 rounded-sm transition-all duration-700 ${experience.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.12)', transitionDelay: `${0.1 + i * 0.1}s` }}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.3)' }}>
                    <Icon name={item.icon} fallback="Building2" size={19} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-off-white font-medium text-[15px] leading-snug">{item.name}</p>
                    <p className="text-xs tracking-widest uppercase text-gold/60 mt-1">{item.sector}</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* БЛОК 6 — РЕЗУЛЬТАТ И СЦЕНАРИИ */}
      <section ref={result.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className={`mb-14 transition-all duration-700 ${result.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Что на выходе</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Двухвекторный вердикт<br />жизнеспособности
            </h2>
            <div className="section-divider mt-6" />
            <p className="text-white/50 text-[15px] leading-relaxed mt-6 max-w-2xl mx-auto">
              По итогам 3–5 дневного аудита вы получаете не размытый отчет, а официальное заключение B2B-Архитектора:
            </p>
          </div>
          <div className={`grid md:grid-cols-2 gap-5 transition-all duration-700 ${result.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '0.15s' }}>
            <div className="p-8 rounded-sm" style={{ background: 'rgba(201,169,110,0.07)', border: '1px solid rgba(201,169,110,0.3)' }}>
              <div className="flex items-center gap-3 mb-4">
                <Icon name="TrendingUp" size={20} className="text-gold" />
                <p className="text-xs tracking-widest uppercase gold-text">Сценарий А · Бизнес «Живой»</p>
              </div>
              <p className="text-white/75 text-[15px] leading-relaxed">
                Вы получаете Архитектурный Чертеж Реанимации — пошаговый план синхронизации маркетинга и ОП с прогнозируемым ростом валовой прибыли на <span className="text-gold font-medium">20% от месяца к месяцу</span>.
              </p>
            </div>
            <div className="p-8 rounded-sm" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-3 mb-4">
                <Icon name="ShieldOff" size={20} className="text-white/40" />
                <p className="text-xs tracking-widest uppercase text-white/40">Сценарий Б · Бизнес «Труп»</p>
              </div>
              <p className="text-white/60 text-[15px] leading-relaxed">
                Я честно говорю вам об этом, сберегая ваши миллионы на бессмысленное лечение, и аккуратно передаю проверенным коллегам-арбитражникам для безопасного выхода без рисков субсидиарной ответственности.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* БЛОК 7 — СТОИМОСТЬ */}
      <section id="prices" ref={prices.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className={`mb-16 transition-all duration-700 ${prices.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Продуктовая матрица</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Форматы работы и стоимости
            </h2>
            <div className="section-divider mt-6" />
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8 items-stretch">
            {PRICES.map((item, i) => (
              <div key={i}
                className={`p-8 rounded-sm flex flex-col transition-all duration-700 ${prices.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{
                  background: item.highlight ? 'rgba(201,169,110,0.06)' : 'rgba(201,169,110,0.03)',
                  border: item.highlight ? '1px solid rgba(201,169,110,0.3)' : '1px solid rgba(201,169,110,0.1)',
                  transitionDelay: `${0.1 + i * 0.12}s`
                }}>
                <p className="text-xs tracking-widest uppercase text-white/30 mb-4">{item.tier} · {item.duration}</p>
                <p className="text-off-white font-medium text-[15px] mb-4 leading-snug">{item.title}</p>
                <p className="font-cormorant text-3xl gold-text font-semibold mb-5">{item.price}</p>
                <p className="text-white/50 text-sm leading-relaxed mb-4">{item.description}</p>
                {item.result && (
                  <p className="text-white/70 text-sm leading-relaxed flex-1 pt-4" style={{ borderTop: '1px solid rgba(201,169,110,0.15)' }}>
                    {item.result}
                  </p>
                )}
                {!item.result && <div className="flex-1" />}
                <button onClick={() => setModalOpen(true)}
                  className="mt-6 text-xs tracking-widest uppercase gold-text hover:opacity-70 transition-opacity flex items-center gap-2">
                  {item.cta} <Icon name="ArrowRight" size={13} />
                </button>
              </div>
            ))}
          </div>
          <div className={`p-6 rounded-sm transition-all duration-700 ${prices.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', transitionDelay: '0.45s' }}>
            <div className="flex items-start gap-4">
              <Icon name="Info" size={16} className="text-white/30 shrink-0 mt-0.5" />
              <p className="text-white/40 text-sm leading-relaxed">
                <span className="text-white/60">Внимание:</span> В месяц я беру в личное сопровождение строго не более 3 компаний. Если вы ищете «черные» схемы или хотите скрыть криминал — не тратьте время, нам не по пути.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* БЛОК 8 — ОБО МНЕ */}
      <section id="about" ref={about.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
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
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-sm"
                  style={{ border: '1px solid rgba(201,169,110,0.15)', zIndex: -1 }} />
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
              <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
                Андрей<br />Дорошенко
              </h2>
              <p className="text-white/50 text-sm mt-4">Дипломированный арбитражный управляющий, B2B-архитектор коммерческих систем</p>
              <div className="w-12 h-px bg-gold mb-8 mt-6" />
              <div className="space-y-5 text-white/65 leading-relaxed text-[15px]">
                <p>Сам прошел процедуру банкротства в качестве директора и собственника, поэтому знаю изнанку процессов и кассовых разрывов изнутри, а не по учебникам.</p>
                <p>Специализируюсь на оцифровке бизнес-процессов, перестройке юнит-экономики и синхронизации маркетинга с продажами.</p>
                <p>Моя задача — зайти на предприятие, спасти продукт, защитить личные активы владельца и выстроить безопасную B2B-стратегию роста.</p>
              </div>
              <button onClick={() => setModalOpen(true)}
                className="mt-10 flex items-center gap-3 text-sm tracking-wider uppercase gold-text hover:opacity-70 transition-opacity">
                <span>Записаться на Zoom-диагностику</span>
                <Icon name="ArrowRight" size={16} />
              </button>

              <div className="mt-10">
                <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">Документ о квалификации</p>
                <a
                  href={DIPLOMA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group relative max-w-xs rounded-sm overflow-hidden"
                  style={{ border: '1px solid rgba(201,169,110,0.25)' }}
                >
                  <img
                    src={DIPLOMA_URL}
                    alt="Диплом арбитражного управляющего"
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ filter: 'brightness(0.9)' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="flex items-center gap-2 text-xs tracking-widest uppercase gold-text">
                      <Icon name="ZoomIn" size={16} />
                      <span>Посмотреть диплом</span>
                    </div>
                  </div>
                </a>
                <p className="text-white/30 text-xs mt-3">
                  Диплом о профессиональной переподготовке · Арбитражный управляющий
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* БЛОК 9 — TELEGRAM */}
      <section ref={telegram.ref} className="py-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className={`transition-all duration-700 ${telegram.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Запасной аэродром</p>
            <h2 className="font-cormorant text-3xl md:text-4xl text-off-white font-light mb-6">
              Не готовы к Zoom-диагностике прямо сейчас?
            </h2>
            <p className="text-white/50 text-[15px] leading-relaxed mb-10 max-w-2xl mx-auto">
              Читайте мои B2B-разборы бесплатно в Telegram. Без купюр и маркетинговой воды разбираю реальные кейсы: как юнит-экономика вылетает в минус, почему саботируются продажи и как сохранять предприятия до вмешательства ФНС.
            </p>
            <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-7 py-4 rounded-sm hover:opacity-80 transition-opacity"
              style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.25)' }}>
              <Icon name="Send" size={16} className="text-gold" />
              <span className="text-off-white text-sm">Читать B2B-разборы в Telegram</span>
              <Icon name="ArrowUpRight" size={14} className="text-gold/50" />
            </a>
          </div>
        </div>
      </section>

      {/* БЛОК 10 — КОНТАКТЫ */}
      <section id="contact" ref={contact.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <div className={`text-center mb-14 transition-all duration-700 ${contact.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Связаться</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Запишитесь на первичную<br />Zoom-диагностику
            </h2>
            <div className="section-divider mt-6" />
            <p className="text-white/50 text-[15px] leading-relaxed mt-6 max-w-xl mx-auto">
              30 минут. Разберем вашу текущую ситуационную карту, оценим ключевые метрики и поймем, есть ли у нас взаимный фит.
            </p>
          </div>

          <div className={`grid md:grid-cols-2 gap-8 mb-12 transition-all duration-700 ${contact.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '0.15s' }}>
            <div>
              <p className="text-xs tracking-widest uppercase text-white/30 mb-5">Контакты</p>
              <div className="space-y-4">
                <a href="tel:89206200034" className="flex items-center gap-3 gold-text hover:opacity-70 transition-opacity">
                  <Icon name="Phone" size={15} className="text-gold/60" />
                  <span className="font-cormorant text-xl">8 920 620-00-34</span>
                </a>
                <a href="mailto:and-doroshe@mail.ru" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors">
                  <Icon name="Mail" size={15} className="text-white/30" />
                  <span className="text-sm">and-doroshe@mail.ru</span>
                </a>
                <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/50 hover:text-gold transition-colors">
                  <Icon name="Send" size={15} className="text-white/30" />
                  <span className="text-sm">@adprodmarketing</span>
                </a>
                <div className="flex items-center gap-3 text-white/40">
                  <Icon name="Clock" size={15} className="text-white/30" />
                  <span className="text-sm">Пн–Пт, 10:00–19:00 (МСК)</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-white/30 mb-5">География работы</p>
              <div className="flex flex-wrap gap-2">
                {CITIES.map((city, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 rounded-sm text-white/50"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={`grid md:grid-cols-2 gap-4 mb-10 transition-all duration-700 ${contact.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '0.25s' }}>
            <div className="flex items-start gap-4 p-5 rounded-sm"
              style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.12)' }}>
              <div className="shrink-0 w-8 h-8 rounded-sm flex items-center justify-center mt-0.5"
                style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)' }}>
                <Icon name="MapPin" size={14} className="text-gold" />
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-white/30 mb-1">Владимир</p>
                <p className="text-off-white text-sm leading-relaxed">просп. Ленина, 29Б, офис 37</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-sm"
              style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.12)' }}>
              <div className="shrink-0 w-8 h-8 rounded-sm flex items-center justify-center mt-0.5"
                style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)' }}>
                <Icon name="MapPin" size={14} className="text-gold" />
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-white/30 mb-1">Москва · м. Курская</p>
                <p className="text-off-white text-sm leading-relaxed">Территория завода «Арма»</p>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-700 ${contact.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '0.3s' }}>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: '#060606' }} className="py-8 px-6 md:px-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="font-cormorant text-lg gold-text">Дорошенко Андрей Анатольевич</p>
            <p className="text-white/25 text-xs mt-1">Арбитражный управляющий · B2B-архитектор</p>
          </div>
          <div className="flex gap-4">
            <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer"
              className="text-white/25 hover:text-gold transition-colors">
              <Icon name="Send" size={16} />
            </a>
            <a href="https://vk.com/a.doroshenko87" target="_blank" rel="noopener noreferrer"
              className="text-white/25 hover:text-white transition-colors">
              <Icon name="Users" size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
