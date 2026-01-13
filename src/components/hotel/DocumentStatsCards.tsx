import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Document } from './types';

interface DocumentStatsCardsProps {
  documents: Document[];
}

export const DocumentStatsCards = ({ documents }: DocumentStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{documents.length}</p>
              <p className="text-xs text-slate-600">Документов</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="BookOpen" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {documents.reduce((sum, doc) => sum + (doc.pages || 0), 0)}
              </p>
              <p className="text-xs text-slate-600">Страниц</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {documents.filter(d => d.status === 'ready').length}
              </p>
              <p className="text-xs text-slate-600">Готовы</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Icon name="Loader2" size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {documents.filter(d => d.status === 'processing').length}
              </p>
              <p className="text-xs text-slate-600">Обработка</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};