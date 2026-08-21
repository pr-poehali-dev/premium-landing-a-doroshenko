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

const PROBLEM_SIGNS = [
  'нет понятной системы привлечения клиентов;',
  'менеджеры работают каждый по-своему;',
  'непонятно, что именно продавать и кому;',
  'нет нормального плана продаж;',
  'CRM существует только для отчетности;',
  'собственник сам остается главным продавцом;',
  'отдел продаж умеет принимать входящие заявки, но не умеет создавать продажи;',
];

const GAME_OBSERVATIONS = [
  'как менеджеры принимают решения;',
  'кто реально умеет продавать;',
  'кто умеет только принимать входящие заявки;',
  'как команда взаимодействует;',
  'где возникают конфликты;',
  'кто берет ответственность;',
  'как работает руководитель;',
  'как менеджеры относятся к клиенту и деньгам.',
];

const STRATEGY_TOPICS = [
  'куда компания должна идти;',
  'какой рынок выбирать;',
  'какие продукты развивать;',
  'где деньги;',
  'что перестать делать;',
  'какие проблемы действительно мешают продажам;',
  'какие решения нужно принять сейчас.',
];

const REBUILD_BLOCKS = [
  { title: 'Продукт', text: 'Что именно компания продает рынку и почему это должны покупать.' },
  { title: 'Лидогенерация', text: 'Откуда появляются потенциальные клиенты и сколько их нужно.' },
  { title: 'Продажи', text: 'Как потенциальный клиент превращается в деньги.' },
  { title: 'Отдел продаж', text: 'Роли, показатели, план, мотивация, контроль и ответственность.' },
  { title: 'CRM', text: 'Какие данные действительно нужны руководителю для управления продажами.' },
  { title: 'Экономика', text: 'Выручка, маржинальность, план продаж, стоимость привлечения и точки риска.' },
  { title: 'Руководитель', text: 'Что должен делать РОП, а что не должен делать собственник.' },
];

const WHO_NEEDS = [
  { icon: 'Factory', title: 'Производственным компаниям', text: 'Когда производство есть, продукт есть, а продажи перестали расти.' },
  { icon: 'Building2', title: 'B2B-компаниям', text: 'Когда продажи держатся на нескольких людях или собственнике.' },
  { icon: 'Users', title: 'Компаниям с действующим отделом продаж', text: 'Когда менеджеры есть, CRM есть, реклама есть — а управляемого результата нет.' },
  { icon: 'UserCog', title: 'Собственникам перед наймом РОП', text: 'Когда возникает мысль «нам нужен руководитель отдела продаж». Но сначала нужно понять, что именно этот человек должен будет руководить.' },
];

const WHO_NOT_NEEDS = [
  'просто обучить менеджеров скриптам;',
  'получить волшебную кнопку;',
  'переложить продажи на внешнего консультанта;',
  'ничего не менять внутри;',
  'получить результат без участия собственника.',
];

const APPROACH_STEPS = [
  { num: '01', title: 'Увидеть', text: 'Игровая диагностика + разговор с собственником + цифры.' },
  { num: '02', title: 'Понять', text: 'Где проблема: люди, продукт, рынок, лиды, продажи, управление или экономика.' },
  { num: '03', title: 'Решить', text: 'Определяем 3–7 изменений, которые дадут максимальный эффект.' },
  { num: '04', title: 'Построить', text: 'Внедряем изменения в коммерческую систему.' },
  { num: '05', title: 'Передать', text: 'Компания получает систему, которой можно управлять без вечного присутствия консультанта.' },
];

const CASES = [
  {
    company: 'ПРОМСИЗ',
    location: 'Производственная компания · оборот 120+ млн ₽',
    status: 'Завершён',
    result: 'Запуск отдела продаж и маркетинга с нуля. 5 новых продавцов + маркетолог за 45 дней. Рост выручки первого месяца: +3,2 млн ₽.',
  },
  {
    company: 'ТЕРРИТОРИЯ ОБЖАРКИ',
    location: 'Производство и B2B-поставки кофе',
    status: 'Завершён',
    result: 'Пересборка коммерческой системы и продукта. Новый продукт СТМ → рост производства до 120 тонн/месяц.',
  },
  {
    company: 'ДОБРЫЕ БУЛКИ',
    location: 'Сетевой пищевой ритейл',
    status: 'Завершён',
    result: 'Систематизация управления продажами и маркетингом. План продаж · управленческий учет · маркетинг · 28 пекарен к 2026 году.',
  },
  {
    company: 'КОЛОС КОФЕ',
    location: 'Текущий проект',
    status: 'В работе',
    result: 'Коммерческая система · продажи · маркетинг · планирование · KPI.',
  },
];

const FORMATS = [
  {
    title: 'Игра-диагностика отдела продаж',
    duration: '1 день · команда 6–12 человек',
    price: 'от 30 000 ₽',
    preset: 'Игра-диагностика отдела продаж',
  },
  {
    title: 'Стратегическая сессия',
    duration: '1 день · собственник / руководство / коммерческая команда',
    price: 'от 50 000 ₽',
    preset: 'Стратегическая сессия',
  },
  {
    title: 'Перезапуск коммерческого блока',
    duration: 'Проект 3–6 месяцев. Точная стоимость после диагностики.',
    price: 'от 150 000 ₽ / месяц',
    preset: 'Перезапуск коммерческого блока',
  },
];

const CITIES_LINE = 'Санкт-Петербург · Москва · Владимир · выезд по России';

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
      <input className="input-dark rounded-sm px-4 py-3 text-sm w-full" placeholder="Имя *" required
        value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
      <input className="input-dark rounded-sm px-4 py-3 text-sm w-full" placeholder="Компания / ниша"
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
            <div className="text-5xl mb-4">✓</div>
            <p className="font-cormorant text-2xl gold-text mb-2">Заявка принята</p>
            <p className="text-white/60 font-golos text-sm">Андрей свяжется с вами лично в ближайшее время</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
            <h3 className="font-cormorant text-2xl text-off-white mb-1">
              {presetTitle ? presetTitle : 'Обсудить ситуацию'}
            </h3>
            <p className="text-white/50 text-sm font-golos mb-2">
              Расскажите, что происходит с продажами — Андрей задаст несколько вопросов и скажет, есть ли смысл начинать работу
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
          {loading ? 'Отправляем...' : 'Обсудить ситуацию'}
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
  const problem = useInView(0.1);
  const offer1 = useInView(0.1);
  const offer2 = useInView(0.1);
  const offer3 = useInView(0.1);
  const notConsulting = useInView(0.1);
  const whoNeeds = useInView(0.1);
  const approach = useInView(0.1);
  const cases = useInView(0.1);
  const about = useInView(0.1);
  const formats = useInView(0.1);
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
        <div className="font-cormorant text-base md:text-lg tracking-widest uppercase gold-text whitespace-nowrap">
          ДОРОШЕНКО
        </div>
        <nav className="hidden lg:flex gap-6 text-xs text-white/40 tracking-widest uppercase">
          <a href="#problem" className="hover:text-white transition-colors">Методология</a>
          <a href="#formats" className="hover:text-white transition-colors">Форматы</a>
          <a href="#cases" className="hover:text-white transition-colors">Кейсы</a>
          <a href="#about" className="hover:text-white transition-colors">Обо мне</a>
          <a href="#contact" className="hover:text-white transition-colors">Контакты</a>
        </nav>
        <button onClick={() => openModal()}
          className="text-xs tracking-widest uppercase gold-text hover:opacity-70 transition-opacity border border-gold/30 px-4 py-2 hidden md:block">
          Обсудить ситуацию
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
              Коммерческий архитектор
            </p>

            <h1 className={`font-cormorant font-light leading-[1.1] mb-6 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ fontSize: 'clamp(1.9rem, 4.2vw, 3.6rem)', transitionDelay: '0.2s' }}>
              Перезапускаю продажи<br />
              <span className="gold-gradient">в B2B-компаниях</span>
            </h1>

            <p className={`text-white/65 text-[15px] md:text-base leading-relaxed mb-8 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '0.3s' }}>
              Не обучаю продавцов продавать по скрипту. Разбираюсь, почему коммерческая система не дает денег — и что в ней нужно изменить.
            </p>

            <div className={`mb-10 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '0.4s' }}>
              <div className="pl-5 border-l border-gold/40 space-y-2">
                <p className="text-off-white text-sm leading-relaxed">Начинаем с команды.</p>
                <p className="text-white/60 text-sm leading-relaxed">
                  Проводим игровую диагностику отдела продаж, смотрим, как люди принимают решения, работают с клиентом и взаимодействуют между собой.
                </p>
                <p className="text-white/60 text-sm leading-relaxed">
                  После диагностики становится понятно, что делать дальше: усилить менеджеров → перестроить отдел продаж → изменить коммерческую модель → пересобрать весь коммерческий блок.
                </p>
              </div>
            </div>

            <div className={`flex flex-col sm:flex-row gap-4 mb-6 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.5s' }}>
              <button onClick={() => openModal('Провести диагностику отдела')} className="btn-gold px-8 py-4 text-sm tracking-wider uppercase rounded-sm">
                Провести диагностику отдела
              </button>
            </div>

            <p className={`text-white/30 text-xs tracking-wide transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.6s' }}>
              {CITIES_LINE}
            </p>
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

      {/* ВАША ПРОБЛЕМА МОЖЕТ БЫТЬ НЕ В МЕНЕДЖЕРАХ */}
      <section id="problem" ref={problem.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className={`mb-10 transition-all duration-700 ${problem.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Методология</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Ваша проблема может быть не в менеджерах
            </h2>
            <div className="section-divider mt-6" />
            <p className="text-white/50 text-[15px] leading-relaxed mt-6 max-w-2xl mx-auto">
              Собственник обычно видит одно: «Продажи просели. Менеджеры плохо работают. Нужен РОП». Но РОП не всегда решает проблему. Если у компании:
            </p>
          </div>

          <div className={`grid md:grid-cols-2 gap-3 mb-10 transition-all duration-700 ${problem.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '0.15s' }}>
            {PROBLEM_SIGNS.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-sm"
                style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.12)' }}>
                <Icon name="Dot" size={18} className="text-gold shrink-0 -mt-0.5" />
                <p className="text-white/65 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          <div className={`p-7 rounded-sm transition-all duration-700 ${problem.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ background: 'rgba(201,169,110,0.07)', border: '1px solid rgba(201,169,110,0.3)', transitionDelay: '0.3s' }}>
            <p className="text-off-white text-[15px] leading-relaxed mb-2">
              Новый РОП просто возглавит ту же самую систему.
            </p>
            <p className="gold-text text-[15px] leading-relaxed font-medium">
              Я сначала разбираюсь с системой.
            </p>
          </div>
        </div>
      </section>

      {/* 01 — ИГРА-ДИАГНОСТИКА */}
      <section id="offer-1" ref={offer1.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <div className={`mb-10 transition-all duration-700 ${offer1.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">01. Игра-диагностика отдела продаж</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">«Город продаж»</h2>
            <p className="text-white/50 text-[15px] leading-relaxed mt-4 max-w-2xl">
              За один день посмотреть на отдел продаж со стороны
            </p>
            <div className="section-divider mt-6 ml-0" style={{ margin: '24px 0 0 0' }} />
          </div>

          <div className={`transition-all duration-700 ${offer1.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '0.15s' }}>
            <p className="text-white/65 text-[15px] leading-relaxed mb-6 max-w-2xl">
              Это не корпоратив и не развлекательный тимбилдинг. Команда играет в специально разработанную деловую игру, а я наблюдаю:
            </p>
            <div className="grid md:grid-cols-2 gap-3 mb-8">
              {GAME_OBSERVATIONS.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-sm"
                  style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.12)' }}>
                  <Icon name="Eye" size={14} className="text-gold shrink-0 mt-0.5" />
                  <p className="text-white/65 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-2xl">
              Отдельно оценивается работа руководителя отдела продаж.
            </p>

            <div className="p-6 rounded-sm mb-8 max-w-2xl"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs tracking-widest uppercase text-white/30 mb-3">После игры собственник получает</p>
              <p className="text-off-white text-sm leading-relaxed mb-2">
                Игровой коммерческий разбор: сильные стороны → слабые стороны → риски → точки роста → рекомендации.
              </p>
              <p className="text-white/50 text-sm leading-relaxed">
                РОП не получает «оценку ради оценки». Собственник получает внешний взгляд на свою коммерческую команду.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-8 text-sm text-white/50">
              <div className="flex items-center gap-2"><Icon name="Users" size={14} className="text-gold/60" /> 5–12 участников</div>
              <div className="flex items-center gap-2"><Icon name="Calendar" size={14} className="text-gold/60" /> 1 рабочий день</div>
              <div className="flex items-center gap-2"><Icon name="MapPin" size={14} className="text-gold/60" /> СПб · Москва · Владимир · выезд</div>
              <div className="flex items-center gap-2 gold-text font-medium"><Icon name="Tag" size={14} /> от 30 000 ₽</div>
            </div>

            <button onClick={() => openModal('Игра-диагностика для отдела продаж')}
              className="btn-gold px-7 py-4 text-sm tracking-wider uppercase rounded-sm">
              Обсудить игру для отдела
            </button>
          </div>
        </div>
      </section>

      {/* 02 — СТРАТЕГИЧЕСКАЯ СЕССИЯ */}
      <section id="offer-2" ref={offer2.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className={`mb-10 transition-all duration-700 ${offer2.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">02. Стратегическая сессия</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">«Шесть шляп»</h2>
            <p className="text-white/50 text-[15px] leading-relaxed mt-4 max-w-2xl">
              Когда собственнику нужно не совещание, а решение
            </p>
          </div>

          <div className={`transition-all duration-700 ${offer2.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '0.15s' }}>
            <p className="text-white/65 text-[15px] leading-relaxed mb-6 max-w-2xl">
              Провожу стратегические сессии для собственников и коммерческих команд. Разбираем:
            </p>
            <div className="grid md:grid-cols-2 gap-3 mb-8">
              {STRATEGY_TOPICS.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-sm"
                  style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.12)' }}>
                  <Icon name="Dot" size={18} className="text-gold shrink-0 -mt-0.5" />
                  <p className="text-white/65 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-2xl">
              Без пятичасового разговора о том, что «надо что-то делать». На выходе — решения и план действий.
            </p>

            <button onClick={() => openModal('Стратегическая сессия')}
              className="btn-gold px-7 py-4 text-sm tracking-wider uppercase rounded-sm">
              Провести стратегическую сессию
            </button>
          </div>
        </div>
      </section>

      {/* 03 — ПЕРЕЗАПУСК КОММЕРЧЕСКОГО БЛОКА */}
      <section id="offer-3" ref={offer3.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className={`mb-14 transition-all duration-700 ${offer3.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">03. Перезапуск коммерческого блока</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Когда проблема уже не в одном менеджере
            </h2>
            <p className="text-white/50 text-[15px] leading-relaxed mt-4 max-w-2xl">
              Если диагностика показывает, что проблема системная, можно идти глубже. Я пересобираю коммерческую систему компании:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {REBUILD_BLOCKS.map((item, i) => (
              <div key={i}
                className={`p-6 rounded-sm transition-all duration-700 ${offer3.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.12)', transitionDelay: `${0.1 + i * 0.08}s` }}>
                <p className="text-off-white font-medium text-sm mb-2">{item.title}</p>
                <p className="text-white/55 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <button onClick={() => openModal('Перезапуск коммерческого блока')}
            className="btn-gold px-7 py-4 text-sm tracking-wider uppercase rounded-sm">
            Обсудить перезапуск
          </button>
        </div>
      </section>

      {/* НЕ КОНСАЛТИНГ НА 6 МЕСЯЦЕВ */}
      <section ref={notConsulting.ref} className="py-20 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className={`transition-all duration-700 ${notConsulting.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Не «консалтинг на 6 месяцев»</p>
            <h2 className="font-cormorant text-3xl md:text-4xl text-off-white font-light mb-6">
              Сначала быстрый результат.<br />Потом масштабирование.
            </h2>
            <p className="text-white/55 text-[15px] leading-relaxed max-w-xl mx-auto mb-3">
              Я не сторонник проектов, в которых первые три месяца мы «погружаемся в специфику». Сначала ищем узкое место, которое мешает компании зарабатывать сейчас. Затем меняем его.
            </p>
            <p className="text-white/75 text-[15px] leading-relaxed max-w-xl mx-auto">
              Если проблема решается за неделю — решаем за неделю. Если требуется пересборка коммерческого блока — строим программу на 3–6 месяцев.
            </p>
          </div>
        </div>
      </section>

      {/* КОМУ ЭТО НУЖНО / НЕ НУЖНО */}
      <section id="who" ref={whoNeeds.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className={`mb-14 transition-all duration-700 ${whoNeeds.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Квалификация</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">Кому это нужно</h2>
            <div className="section-divider mt-6" />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-14">
            {WHO_NEEDS.map((item, i) => (
              <div key={i}
                className={`flex items-start gap-4 p-6 rounded-sm transition-all duration-700 ${whoNeeds.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
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

          <div className={`p-7 rounded-sm transition-all duration-700 ${whoNeeds.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', transitionDelay: '0.5s' }}>
            <p className="text-xs tracking-widest uppercase text-white/40 mb-4">Я не подхожу компаниям, которые хотят</p>
            <div className="space-y-3">
              {WHO_NOT_NEEDS.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Icon name="X" size={14} className="text-white/30 shrink-0 mt-1" />
                  <p className="text-white/50 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* МОЙ ПОДХОД */}
      <section ref={approach.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className={`mb-14 transition-all duration-700 ${approach.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Мой подход</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Сначала увидеть. Потом решить.<br />Потом построить.
            </h2>
            <div className="section-divider mt-6" />
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {APPROACH_STEPS.map((step, i) => (
              <div key={i}
                className={`p-6 rounded-sm transition-all duration-700 ${approach.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.12)', transitionDelay: `${0.1 + i * 0.1}s` }}>
                <p className="font-cormorant text-3xl gold-text font-semibold mb-3">{step.num}</p>
                <p className="text-off-white font-medium text-sm mb-2">{step.title}</p>
                <p className="text-white/55 text-sm leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* КЕЙСЫ */}
      <section id="cases" ref={cases.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className={`mb-16 transition-all duration-700 ${cases.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Кейсы</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Короткие доказательства
            </h2>
            <div className="section-divider mt-6" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {CASES.map((c, i) => (
              <div key={i}
                className={`p-7 rounded-sm flex flex-col transition-all duration-700 ${cases.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.12)', transitionDelay: `${0.1 + i * 0.1}s` }}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-off-white font-medium text-[15px] tracking-wide">{c.company}</p>
                    <p className="text-xs tracking-widest uppercase text-gold/60 mt-1">{c.location}</p>
                  </div>
                  <span className="shrink-0 text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-sm"
                    style={{
                      color: c.status === 'В работе' ? '#FACC15' : '#4ADE80',
                      background: c.status === 'В работе' ? 'rgba(250,204,21,0.1)' : 'rgba(74,222,128,0.1)',
                      border: c.status === 'В работе' ? '1px solid rgba(250,204,21,0.3)' : '1px solid rgba(74,222,128,0.3)',
                    }}>
                    {c.status}
                  </span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{c.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ОБО МНЕ */}
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
                Андрей Дорошенко
              </h2>
              <p className="text-white/50 text-sm mt-4">Коммерческий архитектор и антикризисный управляющий</p>
              <div className="w-12 h-px bg-gold mb-8 mt-6" />
              <div className="space-y-5 text-white/65 leading-relaxed text-[15px]">
                <p>Я не пришел в консалтинг из учебника. Я сам строил продажи, занимался лидогенерацией, продуктами, маркетингом, нанимал продавцов, руководил коммерческими процессами и разбирался с ситуациями, когда бизнесу просто нужны деньги.</p>
                <p>Получил профессиональную переподготовку по направлению «Арбитражный управляющий».</p>
                <p>За годы работы я пришел к простой мысли: продажи — это не отдел. Продажи — это коммерческая система компании.</p>
                <p>Поэтому я смотрю не только на менеджера и его скрипт. Я смотрю на всю цепочку: рынок → продукт → предложение → лид → менеджер → продажа → деньги → прибыль.</p>
                <p className="gold-text font-medium">Если где-то стоит пробка — бессмысленно требовать от менеджера «продавать лучше».</p>
              </div>

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
                      <span>Открыть документ</span>
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

      {/* ФОРМАТЫ РАБОТЫ */}
      <section id="formats" ref={formats.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className={`mb-14 transition-all duration-700 ${formats.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Форматы работы</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Выбираем конкретную проблему,<br />которую нужно решить
            </h2>
            <div className="section-divider mt-6" />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {FORMATS.map((item, i) => (
              <div key={i}
                className={`p-8 rounded-sm flex flex-col transition-all duration-700 ${formats.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ background: 'rgba(201,169,110,0.03)', border: '1px solid rgba(201,169,110,0.1)', transitionDelay: `${0.1 + i * 0.1}s` }}>
                <p className="text-off-white font-medium text-[15px] mb-4 leading-snug">{item.title}</p>
                <p className="text-xs tracking-widest uppercase text-white/30 mb-4">{item.duration}</p>
                <p className="font-cormorant text-3xl gold-text font-semibold mb-6 flex-1">{item.price}</p>
                <button onClick={() => openModal(item.preset)}
                  className="text-xs tracking-widest uppercase gold-text hover:opacity-70 transition-opacity flex items-center gap-2">
                  Обсудить <Icon name="ArrowRight" size={13} />
                </button>
              </div>
            ))}
          </div>

          <div className={`p-7 rounded-sm transition-all duration-700 ${formats.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs tracking-widest uppercase gold-text mb-4">Важно</p>
            <p className="text-white/65 text-[15px] leading-relaxed mb-2">
              Я не продаю вам «консалтинг». Сначала мы выбираем конкретную проблему, которую нужно решить.
            </p>
            <p className="text-white/55 text-sm leading-relaxed mb-2">
              Если для ее решения достаточно одного дня игры — мы проведем игру. Если нужна стратегическая сессия — проведем ее. Если нужна пересборка коммерческого блока — построим программу.
            </p>
            <p className="text-off-white text-sm leading-relaxed font-medium">
              Если я понимаю, что вам вообще не нужен мой продукт — я так и скажу.
            </p>
          </div>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section id="contact" ref={contact.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-14 transition-all duration-700 ${contact.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Первый шаг</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Не надо покупать<br />шестимесячный консалтинг
            </h2>
            <div className="section-divider mt-6" />
            <p className="text-white/50 text-[15px] leading-relaxed mt-6 max-w-2xl mx-auto">
              Расскажите, что происходит у вас с продажами. Я задам несколько вопросов и скажу, есть ли смысл вообще начинать работу.
            </p>
          </div>

          <div className={`grid md:grid-cols-3 gap-8 mb-12 transition-all duration-700 ${contact.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '0.15s' }}>
            <div>
              <p className="text-xs tracking-widest uppercase text-white/30 mb-5">Контакты</p>
              <div className="space-y-4">
                <a href="tel:89206200034" className="flex items-center gap-3 gold-text hover:opacity-70 transition-opacity">
                  <Icon name="Phone" size={15} className="text-gold/60" />
                  <span className="font-cormorant text-xl">+7 (920) 620-00-34</span>
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
              </div>
            </div>

            <div className="md:col-span-2">
              <p className="text-xs tracking-widest uppercase text-white/30 mb-5">География</p>
              <div className="flex items-start gap-3 p-5 rounded-sm max-w-md"
                style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.12)' }}>
                <Icon name="MapPin" size={14} className="text-gold shrink-0 mt-0.5" />
                <p className="text-off-white text-sm leading-relaxed">{CITIES_LINE}</p>
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
            <p className="font-cormorant text-lg gold-text">Андрей Дорошенко</p>
            <p className="text-white/25 text-xs mt-1">Коммерческий архитектор</p>
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
