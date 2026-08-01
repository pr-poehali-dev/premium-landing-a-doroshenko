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

const WHO_ITEMS = [
  'Компания остановилась в росте и начала откатываться назад: идет отток базы клиентов, падают чеки, а старые связки перестали давать результат.',
  'Продажи застряли на пассивных «отгрузках»: инициатива только у покупателя, менеджеры работают как приемщики заказов, а маржа сжимается.',
  'Есть замыленный взгляд на реальность: внутри компании кажется, что «все нормально», но рынок меняется стремительно, конкуренты уходят вперед, и нужно срочно успеть перестроиться.',
  'Существует риск банкротства и субсидиарки в будущем: если не пересобрать коммерческий блок и юнит-экономику прямо сейчас, завтра бизнес упрется в кассовые разрывы и долги.',
];

const CRITERIA_IN = [
  { icon: 'Factory', title: 'Профиль', text: 'Малые и средние производственные компании и сложные B2B-услуги.' },
  { icon: 'TrendingUp', title: 'Масштаб бизнеса', text: 'Годовой оборот от 30 млн до 300 млн рублей.' },
  { icon: 'Users', title: 'Инфраструктура', text: 'Наличие действующего (или просевшего) отдела продаж и накопленной клиентской базы.' },
  { icon: 'Target', title: 'Цель собственника', text: 'Запрос на масштабирование, готовность ломать устаревшие схемы и четкое понимание: «как раньше — больше не работает». Вы ищете внешнего B2B-архитектора с полномочиями для радикальной пересборки системы.' },
];

const CRITERIA_OUT = [
  'Стартапы «на салфетке» без продукта и первых продаж.',
  'Искатели «кнопки бабло», ожидающие, что мы будем звонить за их менеджеров.',
  'Искатели серых схем — на попытки скрыть криминал не тратьте наше время.',
];

const PRICES_L1 = [
  {
    title: 'Прайс-лист «Лидоруб»',
    duration: 'Срок: 5 дней · 15 слайдов',
    price: '15 000 ₽',
    description: 'Автономный инструмент продаж, который переводит входящие лиды в заказанные счета через мессенджер или почту без лишних соплей менеджера.',
  },
  {
    title: 'Книга Продукта для менеджеров',
    duration: 'Срок: от 7 дней',
    price: 'от 10 000 ₽',
    description: 'Быстрый онбординг новичков. Ваша база + наш креатив и базовый минимум «конституции продаж». Новый продавец выкладывается со 2-го дня без нытья РОПа.',
  },
  {
    title: 'Конституция Продаж & Маркетинга',
    duration: 'Срок: 7 дней · 10 пунктов',
    price: '15 000 ₽',
    description: 'Мини-маркетинговая и продажная стратегия прямого действия. 10 жестких решений по пересборке вашей воронки: от УТП и трафика до конкретных действий менеджеров.',
  },
];

const PRICE_L2 = {
  title: 'Стратегический разбор + Тимбилдинг',
  duration: 'Комплексный разбор за 1–2 дня',
  price: 'от 35 000 ₽',
  modules: [
    'Аудит продукта компании в форме стратегической сессии с топами и менеджерами.',
    'Аудит отдела продаж в игровой форме + разбор amoCRM.',
    'Тимбилдинг в форме игры и точный психологический портрет вашей команды.',
  ],
};

const PRICE_L3 = {
  title: 'Антикризисная программа «5 ШАГОВ»',
  duration: 'Срок: 7 дней',
  price: '100 000 ₽',
  description: 'Комплексная пересборка коммерческого блока, отделов продаж и маркетинга действующих производственных и B2B-бизнесов. Пошаговая перенастройка воронки, CRM и процессов по протоколу действующего антикризисного управляющего.',
};

const CASES = [
  {
    company: 'ООО «Промсиз»',
    location: 'Гусь-Хрустальный · оборот 120+ млн ₽/год',
    status: 'Завершён',
    before: 'Отдел продаж висел на 2 менеджерах-«приемщиках заказов». Компания не управляла планом продаж и структурой продаж.',
    action: 'Запустили отдел продаж и отдел маркетинга с нуля в течение 6 месяцев. Совокупный бюджет — около 7 млн рублей.',
    result: 'Рост конверсии в счет до 5%. Вывели 5 новых продавцов и маркетолога за 45 дней. Прирост выручки за первый месяц: +3,2 млн ₽.',
  },
  {
    company: '«Территория Обжарки»',
    location: 'Обжарка зернового кофе',
    status: 'Завершён',
    before: 'Отсутствие отдела продаж и маркетинга.',
    action: 'Программа на 10 месяцев, инвестиции — 10 млн ₽. Полная пересборка смыслов и регламентов, внедрение контроля отработки возражений.',
    result: 'Главная победа — запуск нового продукта СТМ для маркетплейсов: рост производства до 120 тонн в месяц.',
  },
  {
    company: 'Сеть пекарен «Добрые Булки»',
    location: 'Сетевой пищевой ритейл',
    status: 'Завершён',
    before: 'Бизнес полностью не оцифрован: нет управленческого учета и системного плана продаж.',
    action: 'Внедрение iiko и плана продаж на квартал + запуск маркетинга на HR-бренд компании.',
    result: '28 пекарен к 2026 году — лидер рынка Владимирской области.',
  },
  {
    company: 'Великодворский стеклотарный завод',
    location: 'Промышленность · стеклотара',
    status: 'В работе',
    before: 'Предбанкротное состояние, требовалась комплексная антикризисная программа.',
    action: 'Внедрение антикризисной программы: пересборка коммерческого блока, контроль процессов и юнит-экономики.',
    result: 'Проект в активной реализации, итоги — по завершении программы.',
  },
];

const LOCATIONS = [
  { city: 'Санкт-Петербург', tag: 'Главный хаб', address: 'м. Чёрная речка, Торжковская улица, д. 5' },
  { city: 'Москва', tag: '', address: 'м. Курская, Территория завода «Арма»' },
  { city: 'Владимир / Регионы', tag: '', address: 'просп. Ленина, 29Б, офис 37', note: 'Работаем: Нижний Новгород, Иваново, Рязань, Ярославль' },
];

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
            <p className="text-white/60 font-golos text-sm">Мы свяжемся с вами лично в ближайшее время</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
            <h3 className="font-cormorant text-2xl text-off-white mb-1">Консультация</h3>
            <p className="text-white/50 text-sm font-golos mb-2">
              {presetTitle ? `Заявка на: ${presetTitle}` : 'Мы лично свяжемся с вами и согласуем время'}
            </p>
            <LeadFields form={form} setForm={setForm} />
            <button type="submit" disabled={loading} className="btn-gold rounded py-3 text-sm mt-2 disabled:opacity-60">
              {loading ? 'Отправляем...' : 'Записаться на консультацию'}
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
        <p className="text-white/50 text-sm">Мы свяжемся с вами лично в ближайшее время</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
      <LeadFields form={form} setForm={setForm} />
      <div className="md:col-span-2">
        <button type="submit" disabled={loading}
          className="btn-gold rounded-sm py-4 px-12 text-sm tracking-wider uppercase disabled:opacity-60">
          {loading ? 'Отправляем...' : 'Отправить заявку'}
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
  const who = useInView(0.1);
  const myths = useInView(0.1);
  const criteria = useInView(0.1);
  const prices = useInView(0.1);
  const cases = useInView(0.1);
  const telegram = useInView(0.1);
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

      {/* БЛОК 1 — МЕНЮ И ШАПКА */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-4"
        style={{ background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
        <div className="font-cormorant text-base md:text-lg tracking-widest uppercase gold-text whitespace-nowrap">
          ДОРОШЕНКО <span className="text-white/50">И ПАРТНЁРЫ</span>
        </div>
        <nav className="hidden lg:flex gap-6 text-xs text-white/40 tracking-widest uppercase">
          <a href="#myths" className="hover:text-white transition-colors">Методология</a>
          <a href="#prices" className="hover:text-white transition-colors">Стоимость</a>
          <a href="#cases" className="hover:text-white transition-colors">Кейсы</a>
          <a href="#criteria" className="hover:text-white transition-colors">С кем работаем</a>
          <a href="#about" className="hover:text-white transition-colors">О нас</a>
          <a href="#contact" className="hover:text-white transition-colors">Контакты</a>
        </nav>
        <button onClick={() => openModal()}
          className="text-xs tracking-widest uppercase gold-text hover:opacity-70 transition-opacity border border-gold/30 px-4 py-2 hidden md:block">
          Консультация
        </button>
        <a href="tel:89206200034" className="text-sm gold-text hover:opacity-80 transition-opacity font-medium md:hidden">
          8 920 620-00-34
        </a>
      </header>

      {/* БЛОК 2 — HERO */}
      <section ref={hero.ref} className="relative min-h-screen flex items-stretch overflow-hidden pt-16">
        <div className="relative z-10 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20 w-full md:w-1/2">
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(201,169,110,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.025) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
          <div className="relative z-10 max-w-xl">
            <p className={`text-xs tracking-[0.3em] uppercase text-gold/70 mb-8 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.1s' }}>
              Антикризисный управляющий · Коммерческий архитектор
            </p>

            <h1 className={`font-cormorant font-light leading-[1.1] mb-8 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ fontSize: 'clamp(1.9rem, 4.2vw, 3.6rem)', transitionDelay: '0.2s' }}>
              Перезапуск продаж, системный аудит<br />
              <span className="gold-gradient">и защита активов</span> для B2B<br />
              и производственных компаний
            </h1>

            <div className={`mb-10 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '0.35s' }}>
              <div className="pl-5 border-l border-gold/40">
                <p className="text-white/65 text-[15px] md:text-base leading-relaxed italic font-light">
                  «Я знаю, через что вы проходите, потому что сам прошел процедуру банкротства как директор и собственник бизнеса. Мы не занимаемся инфоцыганщиной, "бесплатными чек-листами" и академической теорией. Мы оставляем в вашем бизнесе только твёрдые рабочие инструменты, которые начинают приносить деньги с первого дня».
                </p>
              </div>
            </div>

            <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.5s' }}>
              <button onClick={() => openModal()} className="btn-gold px-8 py-4 text-sm tracking-wider uppercase rounded-sm">
                Записаться на консультацию
              </button>
              <a href="#prices" className="flex items-center justify-center gap-2 px-6 py-4 text-sm tracking-wide text-white/50 hover:text-white transition-colors border border-white/10 rounded-sm hover:border-white/20">
                Посмотреть цены
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

      {/* БЛОК 3 — КО МНЕ ОБРАЩАЮТСЯ */}
      <section ref={who.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className={`mb-14 transition-all duration-700 ${who.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Ко мне обращаются</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Обычно к нам обращаются, когда
            </h2>
            <div className="section-divider mt-6" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {WHO_ITEMS.map((item, i) => (
              <div key={i}
                className={`flex items-start gap-4 p-6 rounded-sm transition-all duration-700 ${who.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.12)', transitionDelay: `${0.1 + i * 0.1}s` }}>
                <Icon name="Check" size={16} className="text-gold shrink-0 mt-0.5" />
                <p className="text-white/75 text-[15px] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* БЛОК 4 — РЫНОЧНЫЕ МИФЫ */}
      <section id="myths" ref={myths.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <div className={`mb-14 transition-all duration-700 ${myths.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Смысловой сдвиг</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Почему чек-листы и самодиагностика<br />больше не работают
            </h2>
            <div className="section-divider mt-6" />
          </div>
          <div className={`space-y-5 transition-all duration-700 ${myths.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '0.15s' }}>
            <div className="p-7 rounded-sm"
              style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.15)' }}>
              <p className="text-white/75 text-[15px] leading-relaxed">
                Ни бесплатные чек-листы из интернета, ни внутренние «самопроверки» силком не решат проблему застрявшего бизнеса. Когда внутри компании взгляд замылен, собственник и команда просто не видят собственных «дыр».
              </p>
            </div>
            <div className="p-7 rounded-sm"
              style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.15)' }}>
              <p className="text-white/75 text-[15px] leading-relaxed">
                Как и при серьезной болезни, бизнесу требуется вмешательство внешнего управляющего.
              </p>
            </div>
            <div className="p-7 rounded-sm"
              style={{ background: 'rgba(201,169,110,0.07)', border: '1px solid rgba(201,169,110,0.3)' }}>
              <p className="text-off-white text-[15px] leading-relaxed">
                Человека со стороны, который заходит на предприятие, без иллюзий и корпоративных реверансов проводит скоринг системы, ставит точный диагноз и руками внедряет жесткие, рабочие инструменты.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* БЛОК 5 — С КЕМ МЫ РАБОТАЕМ */}
      <section id="criteria" ref={criteria.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className={`mb-14 transition-all duration-700 ${criteria.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Квалификация</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Критерии входа в проект
            </h2>
            <div className="section-divider mt-6" />
            <p className="text-white/50 text-[15px] leading-relaxed mt-6 max-w-2xl mx-auto">
              Мы заходим на предприятия строго при наличии следующих критериев:
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {CRITERIA_IN.map((item, i) => (
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

          <div className={`p-7 rounded-sm transition-all duration-700 ${criteria.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', transitionDelay: '0.5s' }}>
            <p className="text-xs tracking-widest uppercase text-white/40 mb-4">С кем мы НЕ работаем</p>
            <div className="space-y-3">
              {CRITERIA_OUT.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Icon name="X" size={14} className="text-white/30 shrink-0 mt-1" />
                  <p className="text-white/50 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* БЛОК 6 — ПРОДУКТОВАЯ ВИТРИНА */}
      <section id="prices" ref={prices.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className={`mb-16 transition-all duration-700 ${prices.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Инвестиции</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Фиксированные чеки. Никакой воды.<br />Только материальные следы в бизнесе.
            </h2>
            <div className="section-divider mt-6" />
          </div>

          {/* Уровень 1 */}
          <div className={`mb-6 flex items-center gap-3 transition-all duration-700 ${prices.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#4ADE80' }} />
            <p className="text-xs tracking-widest uppercase text-white/50">Уровень 1 · Твёрдые следы (быстрый старт / без риска)</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {PRICES_L1.map((item, i) => (
              <div key={i}
                className={`p-8 rounded-sm flex flex-col transition-all duration-700 ${prices.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ background: 'rgba(201,169,110,0.03)', border: '1px solid rgba(201,169,110,0.1)', transitionDelay: `${0.1 + i * 0.1}s` }}>
                <p className="text-xs tracking-widest uppercase text-white/30 mb-4">{item.duration}</p>
                <p className="text-off-white font-medium text-[15px] mb-4 leading-snug">{item.title}</p>
                <p className="font-cormorant text-3xl gold-text font-semibold mb-5">{item.price}</p>
                <p className="text-white/50 text-sm leading-relaxed flex-1">{item.description}</p>
                <button onClick={() => openModal(item.title)}
                  className="mt-6 text-xs tracking-widest uppercase gold-text hover:opacity-70 transition-opacity flex items-center gap-2">
                  Записаться <Icon name="ArrowRight" size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Уровень 2 */}
          <div className={`mb-6 flex items-center gap-3 transition-all duration-700 ${prices.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FACC15' }} />
            <p className="text-xs tracking-widest uppercase text-white/50">Уровень 2 · Глубокое знакомство (погружение в команду)</p>
          </div>
          <div className={`mb-14 p-8 rounded-sm transition-all duration-700 ${prices.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ background: 'rgba(250,204,21,0.05)', border: '1px solid rgba(250,204,21,0.2)' }}>
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start mb-6">
              <div>
                <p className="text-xs tracking-widest uppercase text-white/30 mb-3">{PRICE_L2.duration}</p>
                <p className="text-off-white font-medium text-lg mb-2">{PRICE_L2.title}</p>
              </div>
              <p className="font-cormorant text-4xl gold-text font-semibold">{PRICE_L2.price}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {PRICE_L2.modules.map((m, i) => (
                <div key={i} className="p-4 rounded-sm flex items-start gap-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="text-gold/70 text-xs font-medium shrink-0 mt-0.5">0{i + 1}</span>
                  <p className="text-white/65 text-sm leading-relaxed">{m}</p>
                </div>
              ))}
            </div>
            <button onClick={() => openModal(PRICE_L2.title)}
              className="text-xs tracking-widest uppercase gold-text hover:opacity-70 transition-opacity flex items-center gap-2">
              Записаться <Icon name="ArrowRight" size={13} />
            </button>
          </div>

          {/* Уровень 3 */}
          <div className={`mb-6 flex items-center gap-3 transition-all duration-700 ${prices.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#F87171' }} />
            <p className="text-xs tracking-widest uppercase text-white/50">Уровень 3 · Антикризисная программа</p>
          </div>
          <div className={`p-8 rounded-sm transition-all duration-700 ${prices.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.35)' }}>
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start mb-5">
              <div>
                <p className="text-xs tracking-widest uppercase text-white/30 mb-3">{PRICE_L3.duration}</p>
                <p className="text-off-white font-medium text-lg mb-2">{PRICE_L3.title}</p>
              </div>
              <p className="font-cormorant text-4xl gold-text font-semibold">{PRICE_L3.price}</p>
            </div>
            <p className="text-white/65 text-[15px] leading-relaxed mb-6 max-w-2xl">{PRICE_L3.description}</p>
            <button onClick={() => openModal(PRICE_L3.title)}
              className="text-xs tracking-widest uppercase gold-text hover:opacity-70 transition-opacity flex items-center gap-2">
              Записаться <Icon name="ArrowRight" size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* БЛОК 7 — РЕАЛИЗОВАННЫЕ КЕЙСЫ */}
      <section id="cases" ref={cases.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className={`mb-16 transition-all duration-700 ${cases.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Доказательство методологии</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Результаты пересборки B2B-систем
            </h2>
            <div className="section-divider mt-6" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {CASES.map((c, i) => (
              <div key={i}
                className={`p-7 rounded-sm flex flex-col transition-all duration-700 ${cases.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.12)', transitionDelay: `${0.1 + i * 0.1}s` }}>
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-off-white font-medium text-[15px] leading-snug">{c.company}</p>
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
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-white/30 mb-1.5">Было</p>
                    <p className="text-white/60 text-sm leading-relaxed">{c.before}</p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-white/30 mb-1.5">Что сделали</p>
                    <p className="text-white/60 text-sm leading-relaxed">{c.action}</p>
                  </div>
                  <div className="pt-4" style={{ borderTop: '1px solid rgba(201,169,110,0.15)' }}>
                    <p className="text-[10px] tracking-widest uppercase text-gold/70 mb-1.5">Стало</p>
                    <p className="text-white/85 text-sm leading-relaxed">{c.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* БЛОК 8 — ДИСКЛЕЙМЕР И TELEGRAM */}
      <section ref={telegram.ref} className="py-20 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className={`mb-10 p-6 rounded-sm transition-all duration-700 ${telegram.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-start gap-4 text-left">
              <Icon name="Info" size={16} className="text-white/30 shrink-0 mt-0.5" />
              <p className="text-white/40 text-sm leading-relaxed">
                <span className="text-white/60">Внимание:</span> В личное сопровождение мы берем строго не более 3 компаний в месяц.
              </p>
            </div>
          </div>

          <div className={`transition-all duration-700 ${telegram.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Бесплатно</p>
            <h2 className="font-cormorant text-3xl md:text-4xl text-off-white font-light mb-6">
              Не готовы к платным продуктам?<br />Читайте наши B2B-разборы бесплатно
            </h2>
            <p className="text-white/50 text-[15px] leading-relaxed mb-10 max-w-2xl mx-auto">
              В своем канале я без купюр и юридической воды разбираю реальные кейсы: как налоговая находит скрытые связи, почему летят отделы продаж и как спасать юнит-экономику до субсидиарки.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-7 py-4 rounded-sm hover:opacity-80 transition-opacity"
                style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.25)' }}>
                <Icon name="Send" size={16} className="text-gold" />
                <span className="text-off-white text-sm">Андрей Дорошенко | Антикризисные разборы</span>
                <Icon name="ArrowUpRight" size={14} className="text-gold/50" />
              </a>
              <a href="https://vk.com/a.doroshenko87" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-7 py-4 rounded-sm hover:opacity-80 transition-opacity"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Icon name="Users" size={16} className="text-white/50" />
                <span className="text-white/60 text-sm">ВКонтакте</span>
                <Icon name="ArrowUpRight" size={14} className="text-white/30" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* БЛОК 9 — О НАС И КОМАНДЕ */}
      <section id="about" ref={about.ref} className="py-24 px-6 md:px-16 lg:px-24">
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
              <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">О нас и команде</p>
              <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
                Андрей Дорошенко<br />и партнёры
              </h2>
              <p className="text-white/50 text-sm mt-4">Дипломированный арбитражный управляющий, коммерческий архитектор и специалист по пересборке B2B-систем</p>
              <div className="w-12 h-px bg-gold mb-8 mt-6" />
              <div className="space-y-5 text-white/65 leading-relaxed text-[15px]">
                <p>Сам прошел процедуру банкротства в качестве директора и собственника, поэтому знаю изнанку процесса не по учебникам.</p>
                <p>«Дорошенко и партнёры» — это синергия персональной ответственности коммерческого архитектора и работы команды профильных экспертов (маркетологов, директологов, B2B-копирайтеров и разработчиков).</p>
                <p>Я лично отвечу за смыслы, юнит-экономику и архитектуру вашего проекта, а моя команда обеспечит безупречное техническое воплощение.</p>
              </div>
              <button onClick={() => openModal()}
                className="mt-10 flex items-center gap-3 text-sm tracking-wider uppercase gold-text hover:opacity-70 transition-opacity">
                <span>Записаться на консультацию</span>
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

      {/* БЛОК 10 — КОНТАКТЫ И ЛОКАЦИИ */}
      <section id="contact" ref={contact.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-14 transition-all duration-700 ${contact.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Связаться</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Связаться и записаться<br />на B2B-продукты
            </h2>
            <div className="section-divider mt-6" />
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
              <p className="text-xs tracking-widest uppercase text-white/30 mb-5">География и адреса</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {LOCATIONS.map((loc, i) => (
                  <div key={i} className="flex items-start gap-3 p-5 rounded-sm"
                    style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.12)' }}>
                    <Icon name="MapPin" size={14} className="text-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs tracking-widest uppercase text-white/30 mb-1">
                        {loc.city}{loc.tag && <span className="text-gold/60"> · {loc.tag}</span>}
                      </p>
                      <p className="text-off-white text-sm leading-relaxed">{loc.address}</p>
                      {loc.note && <p className="text-white/40 text-xs leading-relaxed mt-1">{loc.note}</p>}
                    </div>
                  </div>
                ))}
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
            <p className="font-cormorant text-lg gold-text">Дорошенко и партнёры</p>
            <p className="text-white/25 text-xs mt-1">Антикризисный управляющий · Коммерческий архитектор</p>
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