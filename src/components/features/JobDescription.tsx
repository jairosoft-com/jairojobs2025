import { Job } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface JobDescriptionProps {
  job: Job;
}

export function JobDescription({ job }: JobDescriptionProps) {
  // Split description by line breaks to preserve formatting
  const descriptionParagraphs = job.description
    .split('\n')
    .filter(p => p.trim());

  return (
    <div className="space-y-6" data-testid="job-description">
      {/* About the Role */}
      <Card>
        <CardHeader>
          <CardTitle asChild>
            <h2>About the Role</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-gray-700">
            {descriptionParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph.trim()}</p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      {job.requirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle asChild>
              <h2>Requirements</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Responsibilities */}
      {job.responsibilities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle asChild>
              <h2>Responsibilities</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {job.responsibilities.map((resp, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="font-bold text-primary">•</span>
                  <span className="text-gray-700">{resp}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Benefits */}
      {job.benefits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle asChild>
              <h2>Benefits</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {job.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="font-bold text-primary">✓</span>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Required Skills */}
      {job.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle asChild>
              <h2>Required Skills</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {job.tags.map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-sm"
                  data-testid="skill-tag"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
