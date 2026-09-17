import React from 'react';
import { X, Calendar, Mail, Phone, Hash, BookOpen, Clock, ShieldAlert, FileText } from 'lucide-react';
import { StudentCarousel } from '../StudentCarousel/StudentCarousel';
import { calcularIdade, formatarData } from '../../utils/calculateAge';

export function StudentModal({ student, isOpen, onClose, isAdmin = false }) {
  if (!isOpen || !student) return null;

  const fotos = student.fotos || student.aluno_fotos || [];
  const idade = student.data_nascimento ? calcularIdade(student.data_nascimento) : null;
  const cursoNome = student.curso || student.turmas?.cursos?.nome || 'Curso Técnico SENAI';
  const turmaNome = student.turma || student.turmas?.nome || '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px', overflow: 'hidden' }}
      >
        {/* Cabeçalho do Modal */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-blue">{turmaNome}</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Perfil do Aluno
            </span>
          </div>

          <button
            onClick={onClose}
            className="btn-icon btn-ghost"
            style={{ border: 'none', cursor: 'pointer' }}
            title="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mídia: Foto do Aluno em Alta Resolução */}
        <div style={{ width: '100%', maxHeight: '360px', overflow: 'hidden' }}>
          <StudentCarousel
            fotos={fotos}
            studentName={student.nome}
            useThumbnail={false}
          />
        </div>

        {/* Informações */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--senai-blue-900)' }}>
              {student.nome}
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {cursoNome}
            </p>
          </div>

          {/* Dados Visíveis / Acadêmicos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Turma
              </div>
              <div style={{ fontWeight: 700, color: 'var(--senai-blue-900)', marginTop: '0.25rem' }}>
                {turmaNome}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Turno
              </div>
              <div style={{ fontWeight: 700, color: 'var(--senai-blue-900)', marginTop: '0.25rem' }}>
                {student.turno || student.turmas?.turno || 'Não informado'}
              </div>
            </div>
          </div>

          {/* Dados Exclusivos para Administradores/Docentes Autenticados */}
          {isAdmin ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.875rem',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--senai-blue-700)', fontWeight: 700, fontSize: '0.875rem' }}>
                <ShieldAlert size={16} />
                <span>Dados Administrativos (Acesso Restrito)</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
                {student.matricula && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Hash size={16} color="var(--text-muted)" />
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Matrícula: </span>
                      <strong>{student.matricula}</strong>
                    </div>
                  </div>
                )}

                {student.data_nascimento && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} color="var(--text-muted)" />
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Nascimento: </span>
                      <strong>{formatarData(student.data_nascimento)}</strong>
                      {idade !== null && <span style={{ color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>({idade} anos)</span>}
                    </div>
                  </div>
                )}

                {student.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: 'span 2' }}>
                    <Mail size={16} color="var(--text-muted)" />
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>E-mail: </span>
                      <strong>{student.email}</strong>
                    </div>
                  </div>
                )}

                {student.telefone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: 'span 2' }}>
                    <Phone size={16} color="var(--text-muted)" />
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Telefone: </span>
                      <strong>{student.telefone}</strong>
                    </div>
                  </div>
                )}
              </div>

              {student.observacao && (
                <div style={{
                  backgroundColor: 'var(--senai-blue-50)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8125rem',
                  color: 'var(--senai-blue-900)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    <FileText size={14} />
                    <span>Observação Interna</span>
                  </div>
                  <p>{student.observacao}</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              padding: '0.5rem',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)'
            }}>
              🔒 Dados de contato e matrícula são confidenciais e restritos a docentes autorizados.
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button onClick={onClose} className="btn btn-secondary">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
